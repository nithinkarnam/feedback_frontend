import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, loginAdmin } from '../services/authService'
import { getUserInfo } from '../utils/token'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roleType, setRoleType] = useState('USER')
  const [error, setError] = useState(null)
  const [validation, setValidation] = useState(null)
  const navigate = useNavigate()

  async function onSubmit(e){
    e.preventDefault()
    // client-side validation: require gmail.com or outlook.com for users only
    setValidation(null)
    setError(null)
    if (!email || !password) { setValidation('Email and password are required'); return }
    if (roleType === 'USER') {
      const allowed = email.endsWith('@gmail.com') || email.endsWith('@outlook.com')
      if (!allowed) { setValidation('Email must be a @gmail.com or @outlook.com address'); return }
    }

    try{
      let res
      if (roleType === 'ADMIN') res = await loginAdmin(email, password)
      else res = await loginUser(email, password)

      // after login navigate based on role (server-provided) and submission state
      const info = getUserInfo() || res
      const actualRole = (info && info.role) ? info.role.toUpperCase() : (roleType === 'ADMIN' ? 'ADMIN' : 'USER')
      if (actualRole.includes('ADMIN')) {
        navigate('/admin/dashboard')
        return
      }
      // normal user - if already submitted go to my feedback else to submit
      const hasSubmitted = !!localStorage.getItem('has_submitted_feedback')
      navigate(hasSubmitted ? '/feedback/my' : '/feedback/submit')
    }catch(err){
      setError(err.response?.data?.error || err.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card shadow-md p-4 glass fade-in login-meta">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="avatar">CF</div>
            <div>
              <h3 className="card-title mb-0">Welcome back</h3>
              <div className="muted">Sign in to continue to Customer Feedback</div>
            </div>
          </div>

          {validation && <div className="alert alert-warning">{validation}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gmail.com" />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" />
            </div>

            <div className="mb-3 d-flex align-items-center gap-3">
              <div className="btn-group" role="group" aria-label="role selector">
                <button type="button" className={`btn ${roleType==='USER' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={()=>setRoleType('USER')}>User</button>
                <button type="button" className={`btn ${roleType==='ADMIN' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={()=>setRoleType('ADMIN')}>Admin</button>
              </div>
              <div>
                <div className="small"><strong>{roleType === 'ADMIN' ? 'Signing in as Admin' : 'Signing in as User'}</strong></div>
                <div className="muted small">Choose the role you want to sign in with</div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary">Login</button>
              <button type="button" className="btn btn-link" onClick={()=>navigate('/register')}>Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
