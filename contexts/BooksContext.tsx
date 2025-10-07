import { createContext, useEffect, useState, type ReactNode } from "react";
import { databases, client } from "../lib/appwrite";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { useUser } from "../hooks/useUser";

import type { Models } from "react-native-appwrite";
import type { RealtimeResponseEvent } from 'appwrite';

const DATABASE_ID = "68d2cfb6000921ac8f88";
const COLLECTION_ID = "68d2cff5002f3f04013b";

export interface Book extends Models.Document {
  title: string;
  author: string;
  description: string;
  userId: string;
}

interface BooksContext {
  books: Book[];
  fetchBooks: () => Promise<void>;
  fetchBookById: (id: string) => Promise<Models.Document | void>;
  createBook: (data: Omit<Book, keyof Models.Document | 'userId'>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
}

type BooksProviderProps = {
  children: ReactNode;
};

export const BooksContext = createContext<BooksContext | null>(null);

export function BooksProvider({ children }: BooksProviderProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const { user } = useUser();

  async function fetchBooks() {
    if (!user) return; 
    try {
      const response = await databases.listDocuments<Book>(DATABASE_ID, COLLECTION_ID, [
        Query.equal('userId', user.$id),
      ]);
      setBooks(response.documents);
    } catch (error) {
      console.error((error as Error).message); 
    }
  }

  async function fetchBookById(id: string) { 
    try {
      const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
      return response;
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  async function createBook(data: Omit<Book, keyof Models.Document | 'userId'>) {
    if (!user) throw new Error("Usuário não está autenticado para criar um livro.");
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        { ...data, userId: user.$id },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  async function deleteBook(id: string) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`;

    if (user) {
      fetchBooks();

      unsubscribe = client.subscribe(channel, (response: RealtimeResponseEvent<Book>) => {
        const { payload, events } = response;
        if (events[0].includes('create')) {
          setBooks((prevBooks) => [...prevBooks, payload]);
        }
        if (events[0].includes('delete')) {
          setBooks((prevBooks) =>
            prevBooks.filter((book) => book.$id !== payload.$id)
          );
        }
      });
    } else {
      setBooks([]);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  return (
    <BooksContext.Provider
      value={{ books, fetchBooks, fetchBookById, createBook, deleteBook }}
    >
      {children}
    </BooksContext.Provider>
  );
}