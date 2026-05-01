/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // In a real app, you would make an API call to verify the token
        const token = localStorage.getItem("token")

        if (token) {
          // Mock user data - in a real app, this would come from the API
          setUser({
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            role: "Admin",
            tenantId: "123",
          })
        }
      } catch (error) {
        console.error("Authentication error:", error)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      // In a real app, you would make an API call to login
      // Mock successful login
      const mockUser = {
        id: "1",
        name: "John Doe",
        email,
        role: "Admin",
        tenantId: "123",
      }

      // Store token in localStorage
      localStorage.setItem("token", "mock-token")
      setUser(mockUser)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      // In a real app, you would make an API call to register
      // Mock successful registration
      const mockUser = {
        id: "1",
        name,
        email,
        role: "User",
      }

      // Store token in localStorage
      localStorage.setItem("token", "mock-token")
      setUser(mockUser)
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

