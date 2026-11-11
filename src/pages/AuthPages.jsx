import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  function submit(e) {
    e.preventDefault()
    const result = login(form)
    if (!result.ok) return setError(result.message)
    navigate(result.role === 'admin' ? '/admin' : '/dashboard')
  }
  return <AuthFrame>
    <div className="auth-heading"><span className="eyebrow">WELCOME BACK</span><h1>Sign in to your finances.</h1><p>Track spending, plan ahead, and stay in control.</p></div>
    <form className="form-stack" onSubmit={submit}>
      <label>Email address<input type="email" required autoComplete="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="you@example.com" /></label>
      <label>Password<input type="password" required autoComplete="current-password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="Enter your password" /></label>
      {error && <p className="form-error">{error}</p>}
      <button className="button primary full" type="submit">Sign in →</button>
    </form>
    <p className="auth-switch">New here? <Link to="/signup">Create an account</Link></p>
    <div className="demo-note"><strong>Demo admin login</strong><br />admin@budget.local<br />Password: Admin@123</div>
  </AuthFrame>
}

export function SignupPage() {
  const { user, signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  function submit(e) {
    e.preventDefault()
    if (form.password.length < 6) return setError('Use a password with at least 6 characters.')
    const result = signup(form)
    if (!result.ok) return setError(result.message)
    navigate('/dashboard')
  }
  return <AuthFrame>
    <div className="auth-heading"><span className="eyebrow">GET STARTED</span><h1>Make a plan for your money.</h1><p>Create a local demo account in a few seconds.</p></div>
    <form className="form-stack" onSubmit={submit}>
      <label>Full name<input required minLength="2" value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Your name" /></label>
      <label>Email address<input type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="you@example.com" /></label>
      <label>Password<input type="password" required minLength="6" value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder="At least 6 characters" /></label>
      {error && <p className="form-error">{error}</p>}
      <button className="button primary full" type="submit">Create account →</button>
    </form>
    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
  </AuthFrame>
}

function AuthFrame({ children }) {
  return <div className="auth-page"><div className="auth-aside"><div className="brand light"><span className="brand-mark">₹</span> Budget Planner</div><div className="aside-copy"><span className="eyebrow">A CLEARER VIEW</span><h2>Small choices.<br />Stronger finances.</h2><p>A simple place to understand what comes in, what goes out, and what you’re saving for.</p></div><div className="aside-bottom">Built for everyday budgeting.</div></div><section className="auth-panel"><div className="auth-card">{children}</div></section></div>
}
