import React, { useEffect, useState } from 'react'
import { getPending, replyToFeedback } from '../services/feedbackService'

export default function AdminPending(){
  const [list, setList] = useState([])
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [comment, setComment] = useState('')
  const [allowAdditional, setAllowAdditional] = useState(false)

  useEffect(()=>{
    (async ()=>{
      const data = await getPending()
      setList(data)
    })()
  },[])

  async function onReply(e){
    e.preventDefault()
    if (!selected) return
    try{
      await replyToFeedback({ feedbackId: selected.id, adminComment: comment, allowAdditional })
      // refresh
      const d = await getPending()
      setList(d)
      setSelected(null)
      setComment('')
    }catch(err){
      alert(err.response?.data?.error || err.message)
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-2">
        <h4>Pending Feedbacks</h4>
        <div className="mb-3 d-flex gap-2">
          <button className={`btn ${filter==='all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={()=>setFilter('all')}>All</button>
          <button className={`btn ${filter==='positive' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={()=>setFilter('positive')}>Positive</button>
          <button className={`btn ${filter==='neutral' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={()=>setFilter('neutral')}>Neutral</button>
          <button className={`btn ${filter==='negative' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={()=>setFilter('negative')}>Negative</button>
        </div>
        <div className="list-group">
          {list.filter(f=>{
            if (filter==='all') return true
            const score = Number(f.sentimentScore || 0)
            const label = (f.sentimentLabel||'').toLowerCase()
            if (filter==='positive') return label.includes('pos') || score > 0.2
            if (filter==='neutral') return label.includes('neu') || (score >= -0.2 && score <= 0.2)
            return label.includes('neg') || score < -0.2
          }).map(f => (
            <button key={f.id} onClick={()=>setSelected(f)} className={`list-group-item list-group-item-action ${selected && selected.id===f.id ? 'active' : ''}`}>
              <div className="d-flex justify-content-between">
                <div><strong>{f.userName || f.userEmail}</strong></div>
                <div className="text-muted">{f.createdAt ? new Date(f.createdAt).toLocaleString() : ''}</div>
              </div>
              <div className="text-sm">{f.userComment}</div>
              <div className="mt-2 small">
                <div><strong>Q1:Would you recommend our product/service?</strong> {f.q1 || '—'}</div>
                <div><strong>Q2:Would you use our product/service in the future?</strong> {f.q2 || '—'}</div>
                <div><strong>Q3:How would you rate our service?</strong> {f.q3 || '—'}</div>
              </div>
              <div className="muted small mt-2">Sentiment: {f.sentimentLabel || 'N/A'} ({
                f.sentimentScore == null ? '—' : (isNaN(Number(f.sentimentScore)) ? f.sentimentScore : Number(f.sentimentScore).toFixed(2))
              })</div>
              {f.adminComment && <div className="mt-2"><strong>Admin Reply:</strong> {f.adminComment}</div>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4>Reply</h4>
        {selected ? (
          <form onSubmit={onReply} className="card p-3">
            <div><strong>From:</strong> {selected.userEmail}</div>
            <div className="mb-2"><strong>Comment:</strong><div>{selected.userComment}</div></div>
            <div className="mb-2 small"><strong>Q1:Would you recommend our product/service?</strong> {selected.q1 || '—'}</div>
            <div className="mb-2 small"><strong>Q2:Would you use our product/service in the future?</strong> {selected.q2 || '—'}</div>
            <div className="mb-2 small"><strong>Q3:How would you rate our service?</strong> {selected.q3 || '—'}</div>
            <div className="mb-2">
              <label>Admin Comment</label>
              <textarea className="form-control" value={comment} onChange={e=>setComment(e.target.value)} rows={4}></textarea>
            </div>
            <div className="mb-2 form-check">
              <input className="form-check-input" type="checkbox" checked={allowAdditional} onChange={e=>setAllowAdditional(e.target.checked)} />
              <label className="form-check-label">Allow additional feedback</label>
            </div>
            <button className="btn btn-primary">Send Reply</button>
          </form>
        ) : (
          <div className="text-muted">Select a feedback to reply</div>
        )}
      </div>
    </div>
  )
}
