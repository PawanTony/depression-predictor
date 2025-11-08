import React, { useState } from 'react'
import API from '../utils/api'

export default function AuthForm(){
  const [mode, setMode] = useState('login')
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')

  async function submit(e){
    e.preventDefault()
    try{
      const url = mode === 'login' ? '/login' : '/register'
      const { data } = await API.post(url, { username, password })
      localStorage.setItem('token', data.token)
      // save user AES key base64 in localStorage (encrypted by server master key at rest)
      localStorage.setItem('userAesKey', data.userAesKey)
      window.location.href = '/dashboard'
    }catch(e){
      alert(e.response?.data?.error || 'auth failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 card">
      <h2 className="text-2xl mb-4">{mode==='login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input type="password" className="input" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="flex gap-2">
          <button className="btn" type="submit">{mode==='login' ? 'Login' : 'Register'}</button>
          <button type="button" className="btn btn-ghost" onClick={()=>setMode(mode==='login'?'register':'login')}>Switch</button>
        </div>
      </form>
    </div>
  )
}
