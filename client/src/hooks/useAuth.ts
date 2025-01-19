import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

interface User {
  id: string
  email: string
  role: string
  profile: {
    firstName: string
    lastName: string
    avatar?: string
  }
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          const response = await axios.post('/api/auth/login', { email, password })
          const { token, user } = response.data
          
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          })
          
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true })
          const response = await axios.post('/api/auth/register', userData)
          const { token, user } = response.data
          
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          })
          
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        // Remove token from axios headers
        delete axios.defaults.headers.common['Authorization']
        
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        })
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }))
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
