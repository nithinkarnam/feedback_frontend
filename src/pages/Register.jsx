import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [validation, setValidation] = useState(null)
  const navigate = useNavigate()

  async function onSubmit(e){
    e.preventDefault()
    setValidation(null)
    setError(null)
    if (!name || !name.trim()) { setValidation('Name cannot be empty'); return }
    const allowed = email.endsWith('@gmail.com') || email.endsWith('@outlook.com')
    if (!allowed) { setValidation('Email must be a @gmail.com or @outlook.com address'); return }
    try{
      await registerUser(name, email, password)
      navigate('/')
    }catch(err){
      setError(err.response?.data?.error || err.message || 'Register failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card shadow-md p-4 glass">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="avatar">R</div>
            <div>
              <h3 className="card-title mb-0">Create an account</h3>
              <div className="muted">Join to submit feedback and view your responses</div>
            </div>
          </div>

          {validation && <div className="alert alert-warning">{validation}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input className="form-control" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gmail.com" />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Create a password" />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary">Register</button>
              <button type="button" className="btn btn-link" onClick={()=>navigate('/login')}>Back to Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
