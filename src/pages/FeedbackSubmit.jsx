import React, { useState, useEffect } from 'react'
import { submitFeedback, getMyFeedback } from '../services/feedbackService'
import { Link, useNavigate } from 'react-router-dom'

export default function FeedbackSubmit(){
  const [q1, setQ1] = useState('Yes')
  const [q2, setQ2] = useState('Yes')
  const [q3, setQ3] = useState('Excellent')
  const [comment, setComment] = useState('')
  const [result, setResult] = useState(null)
  const [already, setAlready] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    (async ()=>{
      try{
        const data = await getMyFeedback()
        if (data && data.id) {
          setAlready(true)
          localStorage.setItem('has_submitted_feedback', '1')
        }
      }catch(e){
        // ignore network errors here
      }
    })()
  },[])

  async function onSubmit(e){
    e.preventDefault()
    if (already) return
    try{
      const dto = { q1, q2, q3, userComment: comment }
      const res = await submitFeedback(dto)
      setResult({ success: true, message: 'Feedback submitted', data: res })
      // mark that the user submitted
      localStorage.setItem('has_submitted_feedback', '1')
      // navigate to my feedback
      navigate('/feedback/my')
    }catch(err){
      setResult({ success: false, message: err.response?.data?.error || err.message })
    }
  }

  if (already) return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="card p-4 shadow-md glass">
        <h3 className="mb-2">You've already submitted feedback</h3>
        <div className="muted mb-3">Thanks — your feedback has been recorded. You can view or update it from "My Feedback".</div>
        <div className="d-flex gap-2">
          <Link to="/feedback/my" className="btn btn-primary">View My Feedback</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title">Submit Feedback</h3>
          {result && (
            <div className={`alert ${result.success ? 'alert-success' : 'alert-danger'}`}>{result.message}</div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label>Would you recommend our product/service?</label>
              <select className="form-select" value={q1} onChange={e=>setQ1(e.target.value)}>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Would you use our product/service in the future?</label>
              <select className="form-select" value={q2} onChange={e=>setQ2(e.target.value)}>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <div className="mb-3">
              <label>How would you rate our service?</label>
              <select className="form-select" value={q3} onChange={e=>setQ3(e.target.value)}>
                <option>Excellent</option>
                <option>Good</option>
                <option>Average</option>
                <option>Poor</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Comments</label>
              <textarea className="form-control" value={comment} onChange={e=>setComment(e.target.value)} rows={4}></textarea>
            </div>

            <button className="btn btn-primary">Submit Feedback</button>
          </form>
        </div>
      </div>
    </div>
  )
}
