import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: async () => {}
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // STATIC MODE: Set a mock admin user for workflow testing
    setUser({
      id: 'mock-user-123',
      email: 'voyager@traveloop.com',
      full_name: 'Krish Vaghela',
      role: 'admin',
      user_metadata: { full_name: 'Krish Vaghela' }
    })
    setLoading(false)
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
