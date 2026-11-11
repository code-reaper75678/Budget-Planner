import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { useEffect, useState } from 'react'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dark,setDark] = useState(() => localStorage.getItem('bpTheme') === 'dark')
  useEffect(() => { document.documentElement.classList.toggle('dark-mode',dark); localStorage.setItem('bpTheme',dark?'dark':'light') },[dark])
  const admin = user?.role === 'admin'
  function handleLogout() { logout(); navigate('/login') }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">₹</span><span>Budget Planner</span></div>
      <div className="role-tag">{admin ? 'ADMIN MODULE' : 'USER MODULE'}</div>
      <nav>
        {admin ? <>
          <NavLink to="/admin">▦ &nbsp; Admin overview</NavLink>
          <NavLink to="/admin/users">♙ &nbsp; User accounts</NavLink>
        </> : <>
          <NavLink to="/dashboard">▦ &nbsp; Dashboard</NavLink>
          <NavLink to="/transactions">↕ &nbsp; Transactions</NavLink>
          <NavLink to="/analytics">▤ &nbsp; Analytics</NavLink>
          <NavLink to="/budgets">◷ &nbsp; Budgets</NavLink>
          <NavLink to="/goals">◎ &nbsp; Savings goals</NavLink>
        </>}
      </nav>
      <div className="sidebar-bottom">
        <div className="avatar">{user?.name?.slice(0, 1).toUpperCase()}</div>
        <div className="user-meta"><strong>{user?.name}</strong><small>{user?.email}</small></div>
        <button className="icon-button" onClick={handleLogout} title="Log out" aria-label="Log out">↪</button>
      </div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div><span className="eyebrow">PERSONAL FINANCE</span><h1>{admin ? 'Administration' : 'Your money, in focus.'}</h1></div><div className="topbar-actions"><button className="theme-toggle" onClick={()=>setDark(v=>!v)}>{dark?"☀ Light mode":"☾ Dark mode"}</button><span className="online-pill">● Local demo</span></div></header>
      <Outlet />
      <footer>Budget Planner · React + Vite · Demo data is stored in this browser.</footer>
    </main>
  </div>
}
