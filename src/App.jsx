import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'
import { LoginPage, SignupPage } from './pages/AuthPages.jsx'
import { AdminOverview, AdminUsers } from './pages/AdminPages.jsx'
import { Analytics, Budgets, Dashboard, Goals, Transactions } from './pages/UserPages.jsx'

function HomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} replace />
}
function NotFound() {
  return <div className="not-found"><span className="eyebrow">404 ERROR</span><h2>That page isn't here.</h2><p>The route may have moved or the URL may be incorrect.</p><a className="button primary" href="/">Go to home</a></div>
}
function AppRoutes() {
  return <Routes>
    <Route path="/" element={<HomeRedirect />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route element={<ProtectedRoute />}><Route element={<Layout />}>
      <Route element={<ProtectedRoute role="user" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/goals" element={<Goals />} />
      </Route>
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<AdminOverview />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>
    </Route></Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
}
export default function App() { return <AuthProvider><AppRoutes /></AuthProvider> }
