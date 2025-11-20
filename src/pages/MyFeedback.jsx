import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyFeedback, addAdditional } from '../services/feedbackService'
import { getUserInfo } from '../utils/token'

export default function MyFeedback(){
  const [fb, setFb] = useState(null)
  const [additional, setAdditional] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(()=>{
    (async ()=>{
      try{
        const data = await getMyFeedback()
        setFb(data)
        if (data && data.id) localStorage.setItem('has_submitted_feedback', '1')
      }catch(err){
        setMessage({ type: 'danger', text: err.response?.data?.error || err.message })
      }
    })()
  },[])

  const user = getUserInfo()

  async function sendAdditional(e){
    e.preventDefault()
    try{
      const data = await addAdditional(additional)
      setFb(data)
      setMessage({ type: 'success', text: 'Additional feedback submitted' })
    }catch(err){
      setMessage({ type: 'danger', text: err.response?.data?.error || err.message })
    }
  }

  if (!fb) return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="card p-4 mb-4 shadow-md glass d-flex align-items-center">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex gap-3 align-items-center">
            <div className="avatar">{(user?.email||'U').charAt(0).toUpperCase()}</div>
            <div>
              <h4 className="mb-0">Welcome{user?.email ? `, ${user.email.split('@')[0]}` : ''}</h4>
              <div className="muted">Submit a survey or view your past feedback here.</div>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Link to="/feedback/submit" className="btn btn-primary">Give Survey</Link>
            <Link to="/feedback/my" className="btn btn-outline-secondary">Refresh</Link>
          </div>
        </div>
      </div>

      <div className="text-center muted">You haven't submitted feedback yet. Click "Give Survey" to start.</div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">My Feedback</h3>
          {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

          <div className="mb-2"><strong>Q1:Would you recommend our product/service?</strong> {fb.q1}</div>
          <div className="mb-2"><strong>Q2:Would you use our product/service in the future?</strong> {fb.q2}</div>
          <div className="mb-2"><strong>Q3:How would you rate our service?</strong> {fb.q3}</div>
          <div className="mb-2"><strong>Comment:</strong> {fb.userComment}</div>
          <div className="mb-2"><strong>Sentiment:</strong> {fb.sentimentLabel} ({typeof fb.sentimentScore === 'number' ? fb.sentimentScore.toFixed(2) : fb.sentimentScore})</div>
          <div className="mb-2"><strong>Status:</strong> {fb.status}</div>
          <div className="mb-2"><strong>Admin Comment:</strong> {fb.adminComment || '—'}</div>

          {fb.allowAdditional && (
            <form onSubmit={sendAdditional} className="mt-4">
              <div className="mb-3">
                <label>Additional feedback</label>
                <textarea className="form-control" rows={3} value={additional} onChange={e=>setAdditional(e.target.value)} />
              </div>
              <button className="btn btn-primary">Send Additional Feedback</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
