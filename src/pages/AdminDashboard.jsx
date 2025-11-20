import React, { useEffect, useState } from 'react'
import { getDashboard, getPending } from '../services/feedbackService'
import { Link } from 'react-router-dom'

export default function AdminDashboard(){
  const [stats, setStats] = useState(null)
  const [err, setErr] = useState(null)
  const [anim, setAnim] = useState({ total:0, pending:0, replied:0, positive:0, negative:0 })

  useEffect(()=>{
    (async ()=>{
      try{
        const data = await getDashboard()
        setStats(data)
        // also fetch a few recent pending feedbacks for quick action preview
        try{
          const p = await getPending()
          setRecent(p.slice(0,5))
        }catch(e){
          // ignore
        }
        // animate counters
        let start = 0
        const dur = 800
        const startTs = Date.now()
        const step = () => {
          const t = Math.min(1, (Date.now()-startTs)/dur)
          setAnim({
            total: Math.round((data.totalFeedbacks||0)*t),
            pending: Math.round((data.pendingFeedbacks||0)*t),
            replied: Math.round((data.repliedFeedbacks||0)*t),
            positive: Math.round((data.positiveCount||0)*t),
            negative: Math.round((data.negativeCount||0)*t)
          })
          if (t < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }catch(e){
        setErr(e.response?.data?.error || e.message)
      }
    })()
  },[])

  if (err) return <div className="mt-10 text-center text-danger">{err}</div>
  const [recent, setRecent] = useState([])
  if (!stats) return <div className="mt-10 text-center">Loading dashboard...</div>

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 shadow floaty">
          <div className="text-sm text-gray-500">Total Feedbacks</div>
          <div className="text-2xl font-bold stat-number">{anim.total}</div>
        </div>
        <div className="card p-4 shadow floaty">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-bold stat-number">{anim.pending}</div>
        </div>
        <div className="card p-4 shadow floaty">
          <div className="text-sm text-gray-500">Replied</div>
          <div className="text-2xl font-bold stat-number">{anim.replied}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="card p-4 shadow">
          <div>Average Sentiment</div>
          <div className="text-xl">{stats.averageSentiment.toFixed(2)}</div>
        </div>
        <div className="card p-4 shadow text-center">
          <div className="text-sm text-gray-500">Positive</div>
          <div className="text-2xl font-bold stat-number text-green-600">{anim.positive}</div>
        </div>
        <div className="card p-4 shadow text-center">
          <div className="text-sm text-gray-500">Negative</div>
          <div className="text-2xl font-bold stat-number text-red-600">{anim.negative}</div>
        </div>
      </div>

      {/* Quick actions + recent feedback preview */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4 shadow">
          <div className="text-lg font-semibold">Quick Actions</div>
          <div className="mt-3 d-flex flex-column gap-2">
            <Link to="/admin/pending" className="btn btn-primary">Review Pending ({stats.pendingFeedbacks})</Link>
            <Link to="/admin/replied" className="btn btn-outline-secondary">View Replied ({stats.repliedFeedbacks})</Link>
            <Link to="/admin/create" className="btn btn-outline-primary">Create Admin</Link>
          </div>
        </div>

        <div className="card p-4 shadow col-span-2">
          <div className="text-lg font-semibold">Recent Submissions</div>
          <div className="mt-3">
            {recent.length === 0 ? (
              <div className="muted">No recent pending submissions.</div>
            ) : (
              <div className="list-group">
                {recent.map(r => (
                  <div key={r.id} className="list-group-item d-flex justify-content-between align-items-start">
                    <div>
                      <div><strong>{r.userName || r.userEmail}</strong></div>
                      <div className="muted small">{r.userComment}</div>
                      <div className="mt-2 small"><strong>Q1:Would you recommend our product/service?</strong> {r.q1 || '—'}</div>
                      <div className="small"><strong>Q2:Would you use our product/service in the future?</strong> {r.q2 || '—'}</div>
                      <div className="small"><strong>Q3:How would you rate our service?</strong> {r.q3 || '—'}</div>
                      {r.adminComment && <div className="mt-2"><strong>Admin Reply:</strong> {r.adminComment}</div>}
                    </div>
                    <div className="d-flex flex-column align-items-end">
                      <div className="muted small">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</div>
                      <Link to="/admin/pending" className="btn btn-sm btn-primary mt-2">Open</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
