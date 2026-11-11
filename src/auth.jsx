import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const USERS_KEY = 'budgetPlannerUsers'
const SESSION_KEY = 'budgetPlannerSession'

function getUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    if (saved.length) return saved
  } catch {}
  // Demo admin account. Change the password before using this as a real service.
  const starter = [{ id: 'admin-1', name: 'Administrator', email: 'admin@budget.local', password: 'Admin@123', role: 'admin' }]
  localStorage.setItem(USERS_KEY, JSON.stringify(starter))
  return starter
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
  })

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else localStorage.removeItem(SESSION_KEY)
  }, [user])

  function signup({ name, email, password }) {
    const users = getUsers()
    const normalized = email.trim().toLowerCase()
    if (users.some(item => item.email.toLowerCase() === normalized)) {
      return { ok: false, message: 'An account with this email already exists.' }
    }
    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: name.trim(),
      email: normalized,
      password,
      role: 'user',
    }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]))
    const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    setUser(safeUser)
    return { ok: true }
  }

  function login({ email, password }) {
    const users = getUsers()
    const found = users.find(item => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password)
    if (!found) return { ok: false, message: 'Incorrect email or password.' }
    setUser({ id: found.id, name: found.name, email: found.email, role: found.role })
    return { ok: true, role: found.role }
  }

  function logout() { setUser(null) }

  return <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
