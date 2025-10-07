import { useRouter } from "expo-router"
import { useUser } from "../../hooks/useUser"
import { useEffect } from "react"

import ThemedLoader from "../ThemedLoader"

import type { ReactNode } from "react"

interface UserOnlyProps {
  children: ReactNode
}

const UserOnly = ({ children }: UserOnlyProps) => {
  const { user, authChecked} = useUser()
  const router = useRouter()

  useEffect(() => {
    if (authChecked && user === null) {
      router.replace('/login')
    }
  }, [user, authChecked])

  if(!authChecked || !user) {
    return (
      <ThemedLoader />
    )
  }

  return children
}

export default UserOnly