const useLocalStorage = (
  action: 'get' | 'set' | 'remove',
  key: string,
  value?: string
) => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    if (action === 'get') {
      return localStorage.getItem(key)
        ? String(localStorage.getItem(key))
        : null
    }

    if (action === 'set') {
      localStorage.setItem(key, String(value))
    }

    if (action === 'remove') {
      localStorage.removeItem(key)
    }
  }
  return null
}

export default useLocalStorage
