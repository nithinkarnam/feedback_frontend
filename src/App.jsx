import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import FeedbackSubmit from './pages/FeedbackSubmit'
import MyFeedback from './pages/MyFeedback'
import AdminDashboard from './pages/AdminDashboard'
import AdminPending from './pages/AdminPending'
import AdminReplied from './pages/AdminReplied'
import AdminCreate from './pages/AdminCreate'
import { getToken, getUserInfo } from './utils/token'

const PrivateRoute = ({ children, roleRequired }) => {
  const token = getToken()
  if (!token) return <Navigate to="/login" replace />
  if (roleRequired) {
    const user = getUserInfo()
    const role = user?.role?.toUpperCase()
    if (!role || !role.includes(roleRequired)) {
      // unauthorized for this role
      return <Navigate to="/login" replace />
    }
  }
  return children
}

export default function App(){
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/feedback/submit" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/feedback/submit" element={<PrivateRoute><FeedbackSubmit /></PrivateRoute>} />
          <Route path="/feedback/my" element={<PrivateRoute><MyFeedback /></PrivateRoute>} />

          <Route path="/admin/dashboard" element={<PrivateRoute roleRequired="ADMIN"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/pending" element={<PrivateRoute roleRequired="ADMIN"><AdminPending /></PrivateRoute>} />
          <Route path="/admin/replied" element={<PrivateRoute roleRequired="ADMIN"><AdminReplied /></PrivateRoute>} />
          <Route path="/admin/create" element={<PrivateRoute roleRequired="ADMIN"><AdminCreate /></PrivateRoute>} />

          <Route path="*" element={<div className="text-center mt-20">Page not found</div>} />
        </Routes>
      </div>
    </div>
  )
}
