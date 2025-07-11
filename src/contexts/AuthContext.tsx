import { useState, useEffect, createContext } from "react"
import type { ReactNode } from "react"
import { api } from "../api/api"


type UserAPIResponse = {
  token: string
  user: {
    id: string
    email: string
    password: string
  }
}

type AuthContextType = {
  session: null | UserAPIResponse
  createSession: (data: UserAPIResponse) => void
  logout: () => void
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserAPIResponse | null>(null)

  function createSession(data: UserAPIResponse) {
    localStorage.setItem(`@mytasks:user`, JSON.stringify(data.user))
    localStorage.setItem(`@mytasks:token`, data.token)

    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`
    
    setSession(data)
    window.location.assign("/dashboard")
    
  }

  function logout() {
    setSession(null)
    localStorage.removeItem(`@mytasks:user`)
    localStorage.removeItem(`@mytasks:token`)
  }

  function loadUser() {
    const user = localStorage.getItem(`@mytasks:user`)
    const token = localStorage.getItem(`@mytasks:token`)

    if (token && user) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setSession({
        token,
        user: JSON.parse(user),
      })
    }
  }

  useEffect(() => {
    loadUser()
  }, [])
  return (
    <AuthContext.Provider value={{ createSession, logout, session }}>
      {children}
    </AuthContext.Provider>
  )
}
