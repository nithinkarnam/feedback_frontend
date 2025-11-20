import api from './api'

export async function submitFeedback(dto){
  const res = await api.post('/feedback/submit', dto)
  return res.data
}

export async function getMyFeedback(){
  const res = await api.get('/feedback/my')
  return res.data
}

export async function addAdditional(additional){
  const res = await api.put('/feedback/additional', additional)
  return res.data
}

export async function getPending(){
  const res = await api.get('/admin/feedbacks/pending')
  return res.data
}

export async function getReplied(){
  const res = await api.get('/admin/feedbacks/replied')
  return res.data
}

export async function replyToFeedback(dto){
  const res = await api.put('/admin/feedbacks/reply', dto)
  return res.data
}

export async function getDashboard(){
  const res = await api.get('/admin/dashboard')
  return res.data
}
