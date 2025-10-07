import { createContext, useEffect, useState } from "react";
import { account } from "../lib/appwrite";
import { ID } from "react-native-appwrite";

import type { Models } from "react-native-appwrite";
import type { ReactNode } from "react";

interface UserContext {
  user: Models.User<Models.Preferences> | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authChecked: boolean;
}

interface UserProviderProps {
  children: ReactNode
}

export const UserContext = createContext<UserContext | null>(null)

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  async function login(email: string, password: string) {
    try{
      await account.createEmailPasswordSession( email, password)
      const response = await account.get()
      setUser(response)
    } catch (error ) {
      throw Error((error as Error).message)
    }
  }

  async function register(email: string, password: string) {
    try{
      await account.create(ID.unique(), email, password)
      await login(email, password)
    } catch (error) {
      throw Error((error as Error).message)
    }
  }

  async function logout() {
    await account.deleteSession("current")
    setUser(null)
  }

  async function getInitialUserValue() {
    try{
      const response = await account.get()
      setUser(response)
    } catch (error){
      setUser(null)
    } finally {
      setAuthChecked(true)
    }
  }

  useEffect(() => {
    getInitialUserValue()

  }, [])

  return (
    <UserContext.Provider value={{ user, login, register, logout, authChecked }}>
      {children}
    </UserContext.Provider>
  )
}