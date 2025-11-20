import React, { useState } from 'react'
import { createAdmin } from '../services/authService'

export default function AdminCreate(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  async function onSubmit(e){
    e.preventDefault()
    setMessage(null)
    if (!name.trim()) return setMessage({ type: 'danger', text: 'Name required' })
    if (!email.includes('@')) return setMessage({ type: 'danger', text: 'Valid email required' })
    if (!password) return setMessage({ type: 'danger', text: 'Password required' })
    try{
      await createAdmin({ name, email, password })
      setMessage({ type: 'success', text: 'Admin created successfully' })
      setName(''); setEmail(''); setPassword('')
    }catch(err){
      setMessage({ type: 'danger', text: err.response?.data?.error || err.message })
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="card p-4 shadow-md">
        <h4>Create Admin</h4>
        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input className="form-control" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary">Create Admin</button>
        </form>
      </div>
    </div>
  )
}
