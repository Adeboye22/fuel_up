"use client"

import { useEffect } from "react"
import useAuthStore from "@/stores/useAuthStore"

const AuthGuard = ({ children }) => {
  const { init } = useAuthStore()

  useEffect(() => {
    init()
  }, [init])

  return children
}

export default AuthGuard
