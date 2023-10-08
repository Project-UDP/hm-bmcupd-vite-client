import { User } from '../types/User'

const TOKEN_ENTRY = 'hm-bmcudp-token'
const FULLNAME_ENTRY = 'hm-bmcudp-fullname'
const USER_ENTRY = 'hm-bmcudp-user'

export const setStorage = (entry: string, value: string) => {
  localStorage.setItem(entry, value)
}

export const getStorage = (entry: string): string => {
  const value = localStorage.getItem(entry)
  if (
    entry === TOKEN_ENTRY &&
    value === null &&
    window.location.pathname !== '/login'
  ) {
    window.location.replace('login')
  }
  return value ? value : ''
}

export const removeStorage = (entry: string) => {
  localStorage.removeItem(entry)
}

export const localStorageUtil = {
  user: {
    get: (): User | null => {
      const userString = localStorage.getItem(USER_ENTRY)
      return userString ? JSON.parse(userString) : userString
    },

    set: (user: User) => {
      localStorage.setItem(USER_ENTRY, JSON.stringify(user))
    },

    remove: () => {
      localStorage.removeItem(USER_ENTRY)
    }
  },

  token: {
    get: () => {
      return localStorage.getItem(TOKEN_ENTRY)
    },

    set: (token: string) => {
      localStorage.setItem(TOKEN_ENTRY, token)
    },

    remove: () => {
      localStorage.removeItem(TOKEN_ENTRY)
    }
  }
}
