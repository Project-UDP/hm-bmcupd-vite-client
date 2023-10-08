import { useContext } from 'react'
import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { localStorageUtil } from '../utils/localStorageUtils'
import { User } from '../types/User'
import { toastUtils } from '../utils/toastUtils'
import { api } from '../api/api'

export const useAuth = () => useContext(AuthContext)

interface Auth {
  token: string | null
  user: User | null
  onLogin: (username: string, password: string) => void
  onLogout: () => void
}

export const AuthContext = createContext<Auth>({
  token: null,
  user: null,
  onLogin: (username: string, password: string) => {},
  onLogout: () => {}
})

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(
    localStorageUtil.token.get()
  )

  const navigate = useNavigate()

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await api.auth.authenticate(username, password) //authService.authenticate(username, password);
      if (response?.status === 200) {
        const { token, user } = response.data
        localStorageUtil.user.set(user)
        localStorageUtil.token.set(token)
        setToken(token)
        navigate('/search')
        toastUtils.success('')
      }
    } catch (error) {
      toastUtils.error('Неправильный username или пароль')
    }
  }

  const handleLogout = () => {
    setToken('')
    localStorageUtil.user.remove()
    localStorageUtil.token.remove()
    navigate('/login')
  }

  const value: Auth = {
    token,
    user: null,
    onLogin: handleLogin,
    onLogout: handleLogout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
