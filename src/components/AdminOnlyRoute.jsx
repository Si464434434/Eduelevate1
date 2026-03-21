import React from 'react'
import { Navigate } from 'react-router-dom'

export default function AdminOnlyRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/opportunities" replace />
  return children
}
