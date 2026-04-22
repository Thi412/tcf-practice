'use client'

import { useState } from 'react'

interface Topic {
  id: string
  task_type: string
  question: string
  theme: string
  difficulty: string
}

interface TopicPickerProps {
  taskType: 'tache2' | 'tache3'
  currentTopicId: string
  onSelect: (topic: Topic) => void
}

export default function TopicPicker({ taskType, currentTopicId, onSelect }: TopicPickerProps) {
  const [open, setOpen] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/topics?task=' + taskType)
      const data = await res.json()
      setTopics(data.topics ?? [])
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }

  if (open) {
    return (
      <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:99999,display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)'}} onClick={() => setOpen(false)} />
        <div style={{position:'relative',background:'white',borderRadius:'24px 24px 0 0',maxHeight:'75vh',display:'flex',flexDirection:'column'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid #e2e8f0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontWeight:700,fontSize:'18px'}}>📋 Choisir un sujet</span>
            <button onClick={() => setOpen(false)} style={{background:'#f1f5f9',border:'none',borderRadius:'50%',width:'32px',height:'32px',cursor:'pointer',fontSize:'14px'}}>✕</button>
          </div>
          <div style={{overflowY:'auto',padding:'16px',display:'flex',flexDirection:'column',gap:'8px'}}>
            {topics.map(topic => (
              <div key={topic.id} onClick={() => { onSelect(topic); setOpen(false) }}
                style={{padding:'16px',borderRadius:'12px',border: topic.id === currentTopicId ? '2px solid #0ea5e9' : '2px solid #e2e8f0',background: topic.id === currentTopicId ? '#f0f9ff' : 'white',cursor:'pointer'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'8px'}}>
                  <p style={{margin:0,fontSize:'14px',fontWeight:500,lineHeight:'1.4'}}>{topic.question}</p>
                  <span style={{fontSize:'11px',fontWeight:700,padding:'2px 8px',borderRadius:'6px',background: topic.difficulty === 'B2' ? '#ede9fe' : '#e0f2fe',color: topic.difficulty === 'B2' ? '#7c3aed' : '#0369a1',flexShrink:0}}>{topic.difficulty}</span>
                </div>
                <p style={{margin:'4px 0 0',fontSize:'12px',color:'#64748b'}}>{topic.theme}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <button onClick={handleClick} style={{background:'rgba(255,255,255,0.2)',border:'none',borderRadius:'12px',padding:'8px 16px',color:'white',fontSize:'14px',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:'8px'}}>
      {loading ? '⏳' : '📋'} Choisir un sujet
    </button>
  )
}