import React, { useEffect, useState } from 'react'
import { getReplied } from '../services/feedbackService'

export default function AdminReplied(){
  const [list, setList] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(()=>{
    (async ()=>{
      const data = await getReplied()
      setList(data)
    })()
  },[])

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <h4>Replied Feedbacks</h4>
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
        }).map(f=> (
          <div key={f.id} className="list-group-item">
            <div className="d-flex justify-content-between">
              <div><strong>{f.userName || f.userEmail}</strong></div>
              <div className="text-muted">{f.updatedAt ? new Date(f.updatedAt).toLocaleString() : ''}</div>
            </div>
            <div className="mt-1">{f.userComment}</div>
            <div className="mt-2 small"><strong>Q1:</strong> {f.q1 || '—'}</div>
            <div className="mt-1 small"><strong>Q2:</strong> {f.q2 || '—'}</div>
            <div className="mt-1 small"><strong>Q3:</strong> {f.q3 || '—'}</div>
            <div className="mt-2"><strong>Admin Reply:</strong> {f.adminComment}</div>
            <div className="muted small">Sentiment: {f.sentimentLabel || 'N/A'} ({
              f.sentimentScore == null ? '—' : (isNaN(Number(f.sentimentScore)) ? f.sentimentScore : Number(f.sentimentScore).toFixed(2))
            })</div>
          </div>
        ))}
      </div>
    </div>
  )
}
