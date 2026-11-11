import { useEffect, useState } from 'react'

function readUsers() {
  try { return JSON.parse(localStorage.getItem('budgetPlannerUsers') || '[]') } catch { return [] }
}
export function AdminOverview() {
  const [users,setUsers] = useState(readUsers)
  useEffect(()=>{const sync=()=>setUsers(readUsers());window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync)},[])
  const regular = users.filter(u=>u.role==='user')
  return <div className="page-content"><div className="page-title"><span className="eyebrow">ADMIN MODULE</span><h2>System overview</h2><p>View local demo account information and the current application status.</p></div>
    <div className="stats-grid admin-stats"><article className="stat-card featured"><div className="stat-top"><span>Registered users</span><span className="stat-icon">♙</span></div><strong>{regular.length}</strong><small>Accounts created on this browser</small></article><article className="stat-card"><div className="stat-top"><span>Admin accounts</span><span className="stat-icon">⚙</span></div><strong>{users.filter(u=>u.role==='admin').length}</strong><small>Administrator access</small></article><article className="stat-card"><div className="stat-top"><span>Storage mode</span><span className="stat-icon">▤</span></div><strong className="status-word">Local</strong><small>Browser localStorage</small></article><article className="stat-card"><div className="stat-top"><span>Application</span><span className="stat-icon">✓</span></div><strong className="status-word">Ready</strong><small>React + Vite frontend</small></article></div>
    <section className="panel"><div className="panel-heading"><div><span className="eyebrow">ADMIN CHECKLIST</span><h2>Available modules</h2></div></div><div className="module-list"><div><span className="module-icon">♙</span><div><strong>User module</strong><p>Dashboard, transactions, budgets, and savings goals.</p></div><span className="status-badge">Active</span></div><div><span className="module-icon">⚙</span><div><strong>Admin module</strong><p>Overview and registered-account listing.</p></div><span className="status-badge">Active</span></div><div><span className="module-icon">🔐</span><div><strong>Authentication</strong><p>Login, signup, role-based route protection.</p></div><span className="status-badge">Active</span></div></div></section>
    <div className="notice-card"><strong>Important security note</strong><p>This is a college-project demo. Local Storage is not secure authentication: users can inspect or modify data in their browser. Use a backend and hashed passwords for a production app.</p></div>
  </div>
}
export function AdminUsers() {
  const [users,setUsers] = useState(readUsers)
  function refresh(){setUsers(readUsers())}
  return <div className="page-content"><div className="page-title"><span className="eyebrow">ADMIN MODULE</span><h2>User accounts</h2><p>Inspect accounts registered in this browser's local storage.</p></div>
    <section className="panel"><div className="panel-heading"><h2>Registered accounts</h2><button className="button secondary" onClick={refresh}>Refresh list</button></div>
      {users.length===0?<p className="muted">No accounts found.</p>:<div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td><strong>{u.name}</strong></td><td>{u.email}</td><td><span className={`type-pill ${u.role==='admin'?'admin-pill':'income'}`}>{u.role}</span></td></tr>)}</tbody></table></div>}
    </section><div className="notice-card"><strong>Data scope</strong><p>Because this project uses localStorage, this list only includes accounts created in the same browser profile. It is not a shared database.</p></div>
  </div>
}
