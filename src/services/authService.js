import api from './api'
import { saveToken, saveUserInfo, removeToken } from '../utils/token'

export async function loginUser(email, password){
  const res = await api.post('/auth/user/login', { email, password })
  const data = res.data
  saveToken(data.token)
  saveUserInfo({ role: data.role, email: data.email })
  return data
}

export async function loginAdmin(email, password){
  const res = await api.post('/auth/admin/login', { email, password })
  const data = res.data
  saveToken(data.token)
  saveUserInfo({ role: data.role, email: data.email })
  return data
}

export async function registerUser(name, email, password){
  const res = await api.post('/auth/user/register', { name, email, password })
  const data = res.data
  saveToken(data.token)
  saveUserInfo({ role: data.role, email: data.email })
  return data
}

export async function createAdmin(dto){
  // Assumption: backend provides an endpoint to create admin accounts at /auth/admin/register
  const res = await api.post('/auth/admin/register', dto)
  return res.data
}

export function logout(){
  removeToken()
  window.location.href = '/login'
}
