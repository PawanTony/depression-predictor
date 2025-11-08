import React from 'react'

export default function ProtectedRoute({ children }){
  const token = localStorage.getItem('token')
  if (!token) return window.location.href = '/login'
  return children
}
