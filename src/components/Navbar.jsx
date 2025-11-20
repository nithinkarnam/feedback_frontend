import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUserInfo } from '../utils/token'
import { logout } from '../services/authService'
import Logo from '../assets/logo.svg'

export default function Navbar(){
  const user = getUserInfo()
  const hasSubmitted = !!localStorage.getItem('has_submitted_feedback')
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-3">
        <div className="header-brand">
          <img src={Logo} className="logo-svg" alt="logo" />
          <div>
            <div className="font-bold text-lg">Customer Feedback</div>
            <div className="text-sm text-gray-500">Professional Feedback System</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link to="/login" className="btn btn-outline-primary">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}

          {user && user.role === 'USER' && (
            <>
              {hasSubmitted ? (
                <Link to="/feedback/my" className="btn btn-link">My Feedback</Link>
              ) : (
                <Link to="/feedback/submit" className="btn btn-link">Give Feedback</Link>
              )}
              <div className="d-flex align-items-center gap-2">
                <div className="avatar">{(user.email||'U').charAt(0).toUpperCase()}</div>
                <button onClick={onLogout} className="btn btn-danger">Logout</button>
              </div>
            </>
          )}

          {user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
            <>
              <div className="dropdown">
                <button className="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Admin</button>
                <ul className="dropdown-menu dropdown-menu-end p-2">
                  <li><Link className="dropdown-item" to="/admin/dashboard">Dashboard</Link></li>
                  <li><Link className="dropdown-item" to="/admin/pending">Pending</Link></li>
                  <li><Link className="dropdown-item" to="/admin/replied">Replied</Link></li>
                  <li><hr className="dropdown-divider"/></li>
                  <li><Link className="dropdown-item text-primary" to="/admin/create">Create Admin</Link></li>
                </ul>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="avatar">A</div>
                <button onClick={onLogout} className="btn btn-danger">Logout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
