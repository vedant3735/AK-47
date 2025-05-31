"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "submitter" | "viewer"

type User = {
  username: string
  role: UserRole
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hardcoded users with roles as specified
const USERS = {
  vrinda: { password: "violet", hint: "my favourite color", role: "submitter" as UserRole },
  anirvesh: { password: "kaleshiaurat", hint: "", role: "viewer" as UserRole },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is stored in localStorage on initial load
    const storedUser = localStorage.getItem("grievancePortalUser")
    if (storedUser) {
      const userRole = USERS[storedUser as keyof typeof USERS]?.role || "submitter"
      setUser({ username: storedUser, role: userRole })

      // Also set the cookie for API requests
      document.cookie = `grievancePortalUser=${storedUser}; path=/; max-age=86400; SameSite=Strict`
      document.cookie = `userRole=${userRole}; path=/; max-age=86400; SameSite=Strict`
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    const lowercaseUsername = username.toLowerCase()

    console.log("Login attempt:", lowercaseUsername)
    console.log("Valid users:", Object.keys(USERS))

    if (USERS[lowercaseUsername as keyof typeof USERS]?.password === password) {
      console.log("Password matched")
      const userRole = USERS[lowercaseUsername as keyof typeof USERS].role
      setUser({ username: lowercaseUsername, role: userRole })

      // Store in localStorage
      localStorage.setItem("grievancePortalUser", lowercaseUsername)

      // Also set the cookie for API requests
      document.cookie = `grievancePortalUser=${lowercaseUsername}; path=/; max-age=86400; SameSite=Strict`
      document.cookie = `userRole=${userRole}; path=/; max-age=86400; SameSite=Strict`

      return true
    }

    console.log("Password did not match")
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("grievancePortalUser")

    // Clear the cookies
    document.cookie = "grievancePortalUser=; path=/; max-age=0; SameSite=Strict"
    document.cookie = "userRole=; path=/; max-age=0; SameSite=Strict"
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function getPasswordHint(username: string): string {
  const lowercaseUsername = username.toLowerCase()
  return USERS[lowercaseUsername as keyof typeof USERS]?.hint || ""
}
