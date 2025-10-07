import { StyleSheet, Text } from 'react-native'
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { use, useEffect, useState } from 'react';
import { useBooks } from '../../../hooks/useBooks';

import Spacer from "../../../components/Spacer";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import ThemedCard from "../../../components/ThemedCard";
import ThemedButton from "../../../components/ThemedButton";
import ThemedLoader from "../../../components/ThemedLoader";
import { Colors } from '../../../constants/Colors';

import type { Book } from '../../../contexts/BooksContext'; 

const BookDetails = () => {
  const[book, setBook] = useState<Book | null>(null);

  const { id } = useLocalSearchParams();
  const { fetchBookById, deleteBook } = useBooks();
  const router = useRouter()

  const handleDelete = async () => {
    if (typeof id === 'string') {
      await deleteBook(id);
      setBook(null);
      router.replace('/books');
    } else {
      console.error("Erro: O ID do livro não é uma string válida.");
    }
  }

  useEffect(() => {
    async function loadBook() {
      if (typeof id === 'string') {
        const bookData = await fetchBookById(id);
        if (bookData) {
          setBook(bookData as Book);
        }
      }
    }

    loadBook()
  }, [id])

  if (!book) {
    return (
      <ThemedView safe={true} style={styles.container}>
        <ThemedLoader />
      </ThemedView>
    )
  }

  return (
    <ThemedView safe={true} style={styles.container}>
      <ThemedCard style={styles.card}>
        <ThemedText style={styles.title}>{book.title}</ThemedText>
        <ThemedText>Written by {book.author}</ThemedText>
        <Spacer />

        <ThemedText title={true}>Book description:</ThemedText>
        <Spacer height={10} />

        <ThemedText>{book.description}</ThemedText>
      </ThemedCard>

      <ThemedButton style={styles.delete} onPress={handleDelete}>
        <Text style={{ color: '#fff', textAlign: 'center'}}>
          Delete Book
        </Text>
      </ThemedButton>
    </ThemedView>
  )
}

export default BookDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  title: {
    fontSize: 22,
    marginVertical: 10
  },
  card: {
    margin: 20,
  },
  delete: {
    marginTop: 40,
    backgroundColor: Colors.warning,
    width: 200,
    alignSelf: 'center',
  }
})