import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
import { encryptJSON, decryptJSON } from '../utils/crypto'
import API from '../utils/api'

export default function MoodTracker(){
  const [mood, setMood] = useState(5)
  const [history, setHistory] = useState([])

  useEffect(()=>{ (async ()=>{
    const key = localStorage.getItem('userAesKey')
    const payload = localStorage.getItem('moodHistoryEncrypted')
    if (payload && key){
      try{
        const data = await decryptJSON(key, payload)
        setHistory(data)
      }catch(e){ console.warn('decrypt fail', e) }
    }
  })() }, [])

  async function add(){
    const entry = { mood, date: new Date().toISOString() }
    const next = [...history, entry].slice(-30)
    setHistory(next)
    const key = localStorage.getItem('userAesKey')
    const payload = await encryptJSON(key, next)
    localStorage.setItem('moodHistoryEncrypted', payload)
    try{ await API.post('/results', { dataEncrypted: payload }) }catch(e){ console.warn('sync fail') }
  }

  const data = { labels: history.map(h=>new Date(h.date).toLocaleDateString()), datasets:[{ label:'Mood', data: history.map(h=>h.mood), tension:0.3 }] }

  return (
    <div className="card">
      <h3>Mood Tracker</h3>
      <div className="flex items-center gap-3 mt-2">
        <input type="range" min="1" max="10" value={mood} onChange={e=>setMood(Number(e.target.value))} />
        <div className="w-10 text-center">{mood}</div>
        <button className="btn" onClick={add}>Save</button>
      </div>
      <div className="mt-3">
        {history.length ? <Line data={data} /> : <p className="text-slate-500">No mood data yet.</p>}
      </div>
    </div>
  )
}
