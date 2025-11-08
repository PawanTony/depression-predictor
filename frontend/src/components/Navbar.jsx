import React from 'react'

export default function Navbar(){
  function logout(){ localStorage.removeItem('token'); localStorage.removeItem('userAesKey'); window.location.href = '/login' }
  return (
    <nav className="bg-white shadow py-3">
      <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold">MoodPredictor</div>
          <div className="text-sm text-slate-500">Privacy-first demo</div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="text-sm">Dashboard</a>
          <a href="/questionnaire" className="text-sm">Questionnaire</a>
          <button onClick={logout} className="btn">Logout</button>
        </div>
      </div>
    </nav>
  )
}
