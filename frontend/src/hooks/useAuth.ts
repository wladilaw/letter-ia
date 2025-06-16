import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MotivAIClient } from '@/lib/api/client'
import type { User, LoginRequest, RegisterRequest } from '@/lib/api/types'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  })
  const router = useRouter()
  const client = new MotivAIClient()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      client.setAccessToken(token)
      loadUser()
    } else {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const loadUser = async () => {
    try {
      const { data } = await client.getCurrentUser()
      setState({ user: data, isLoading: false, error: null })
    } catch (error) {
      setState({ user: null, isLoading: false, error: 'Erreur de chargement du profil' })
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  const login = async (credentials: LoginRequest) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      const { data } = await client.login(credentials)
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      client.setAccessToken(data.accessToken)
      await loadUser()
      router.push('/dashboard')
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Identifiants invalides'
      }))
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      await client.register(data)
      await login({ email: data.email, password: data.password })
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erreur lors de l\'inscription'
      }))
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setState({ user: null, isLoading: false, error: null })
    router.push('/login')
  }

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout
  }
} 