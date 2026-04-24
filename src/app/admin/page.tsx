'use client'

import { useState, useEffect } from 'react'

interface Topic {
  id: string
  task_type: string
  question: string
  theme: string
  difficulty: string
  is_active: boolean
}

interface Idea {
  id: string
  topic_id: string
  idea: string
  ready_sentence: string
  position: string
  sample_opinion?: string
}

const THEMES = ['Technologie','Travail','Environnement','Éducation','Santé','Loisirs','Société','Alimentation','Sport','Voyages','Famille','Culture','Politique','Économie']

function IdeaRow({ idea, onDelete, onUpdate }: { idea: Idea; onDelete: (id: string) => void; onUpdate: (idea: Idea) => void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(idea)

  async function save() {
    const res = await fetch('/api/admin/ideas', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.idea) { onUpdate(data.idea); setEditing(false) }
  }

  if (editing) {
    return (
      <div style={{background:'#f0f9ff',border:'2px solid #0ea5e9',borderRadius:'12px',padding:'12px',marginBottom:'8px'}}>
        <select value={form.position} onChange={e => setForm({...form, position: e.target.value})} style={{width:'100%',padding:'6px',borderRadius:'8px',border:'1px solid #e2e8f0',marginBottom:'8px',fontSize:'13px'}}>
          <option value="pour">✅ Pour</option>
          <option value="contre">❌ Contre</option>
          <option value="neutral">⚪ Neutral</option>
        </select>
        <input value={form.idea} onChange={e => setForm({...form, idea: e.target.value})} placeholder="Idée courte" style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e2e8f0',marginBottom:'8px',fontSize:'13px',boxSizing:'border-box'}} />
        <textarea value={form.ready_sentence} onChange={e => setForm({...form, ready_sentence: e.target.value})} placeholder="Phrase prête à dire" rows={2} style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e2e8f0',marginBottom:'8px',fontSize:'13px',boxSizing:'border-box',resize:'vertical'}} />
        <textarea value={form.sample_opinion || ''} onChange={e => setForm({...form, sample_opinion: e.target.value})} placeholder="Opinion complète (optionnel)" rows={2} style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e2e8f0',marginBottom:'8px',fontSize:'13px',boxSizing:'border-box',resize:'vertical'}} />
        <div style={{display:'flex',gap:'8px'}}>
          <button onClick={save} style={{flex:1,padding:'8px',background:'#0ea5e9',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600}}>✅ Sauver</button>
          <button onClick={() => setEditing(false)} style={{flex:1,padding:'8px',background:'#f1f5f9',border:'none',borderRadius:'8px',cursor:'pointer'}}>Annuler</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{display:'flex',alignItems:'flex-start',gap:'8px',padding:'10px',background:'white',borderRadius:'10px',border:'1px solid #e2e8f0',marginBottom:'6px'}}>
      <span style={{fontSize:'12px',padding:'2px 8px',borderRadius:'6px',fontWeight:700,flexShrink:0,background:idea.position==='pour'?'#dcfce7':idea.position==='contre'?'#fee2e2':'#f1f5f9',color:idea.position==='pour'?'#16a34a':idea.position==='contre'?'#dc2626':'#64748b'}}>
        {idea.position === 'pour' ? '✅' : idea.position === 'contre' ? '❌' : '⚪'}
      </span>
      <div style={{flex:1,minWidth:0}}>
        <p style={{margin:0,fontWeight:600,fontSize:'13px',color:'#0f172a'}}>{idea.idea}</p>
        <p style={{margin:'2px 0 0',fontSize:'12px',color:'#64748b',fontStyle:'italic'}}>"{idea.ready_sentence}"</p>
      </div>
      <div style={{display:'flex',gap:'4px',flexShrink:0}}>
        <button onClick={() => setEditing(true)} style={{padding:'4px 8px',background:'#fef9c3',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'12px'}}>✏️</button>
        <button onClick={() => onDelete(idea.id)} style={{padding:'4px 8px',background:'#fee2e2',border:'none',borderRadius:'6px',cursor:'pointer',fontSize:'12px'}}>🗑️</button>
      </div>
    </div>
  )
}

function AddIdeaForm({ topicId, onAdd }: { topicId: string; onAdd: (idea: Idea) => void }) {
  const [form, setForm] = useState({ idea: '', ready_sentence: '', position: 'pour', sample_opinion: '' })
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!form.idea || !form.ready_sentence) return
    setLoading(true)
    const res = await fetch('/api/admin/ideas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, topic_id: topicId }) })
    const data = await res.json()
    if (data.idea) { onAdd(data.idea); setForm({ idea: '', ready_sentence: '', position: 'pour', sample_opinion: '' }) }
    setLoading(false)
  }

  return (
    <div style={{background:'#f8fafc',border:'1px dashed #94a3b8',borderRadius:'12px',padding:'12px',marginTop:'8px'}}>
      <p style={{margin:'0 0 8px',fontWeight:700,fontSize:'13px',color:'#0ea5e9'}}>➕ Ajouter une idée</p>
      <select value={form.position} onChange={e => setForm({...form, position: e.target.value})} style={{width:'100%',padding:'6px',borderRadius:'8px',border:'1px solid #e2e8f0',marginBottom:'8px',fontSize:'13px'}}>
        <option value="pour">✅ Pour</option>
        <option value="contre">❌ Contre</option>
        <option value="neutral">⚪ Neutral</option>
      </select>
      <input value={form.idea} onChange={e => setForm({...form, idea: e.target.value})} placeholder="Idée courte" style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e2e8f0',marginBottom:'8px',fontSize:'13px',boxSizing:'border-box'}} />
      <textarea value={form.ready_sentence} onChange={e => setForm({...form, ready_sentence: e.target.value})} placeholder="Phrase prête à dire (ex: À mon avis, ...)" rows={2} style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e2e8f0',marginBottom:'8px',fontSize:'13px',boxSizing:'border-box',resize:'vertical'}} />
      <textarea value={form.sample_opinion} onChange={e => setForm({...form, sample_opinion: e.target.value})} placeholder="Opinion complète (optionnel)" rows={2} style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e2e8f0',marginBottom:'8px',fontSize:'13px',boxSizing:'border-box',resize:'vertical'}} />
      <button onClick={submit} disabled={loading || !form.idea || !form.ready_sentence} style={{width:'100%',padding:'10px',background:loading?'#94a3b8':'#0ea5e9',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:700,fontSize:'14px'}}>
        {loading ? '⏳ Ajout...' : '➕ Ajouter'}
      </button>
    </div>
  )
}

function TopicCard({ topic, onDelete, onUpdate }: { topic: Topic; onDelete: (id: string) => void; onUpdate: (t: Topic) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(topic)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loadingIdeas, setLoadingIdeas] = useState(false)

  async function loadIdeas() {
    if (ideas.length > 0) return
    setLoadingIdeas(true)
    const res = await fetch('/api/admin/ideas?topicId=' + topic.id)
    const data = await res.json()
    setIdeas(data.ideas ?? [])
    setLoadingIdeas(false)
  }

  function toggleExpand() {
    if (!expanded) loadIdeas()
    setExpanded(!expanded)
  }

  async function saveTopic() {
    const res = await fetch('/api/admin/topics', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.topic) { onUpdate(data.topic); setEditing(false) }
  }

  async function deleteIdea(id: string) {
    await fetch('/api/admin/ideas?id=' + id, { method: 'DELETE' })
    setIdeas(ideas.filter(i => i.id !== id))
  }

  return (
    <div style={{border:'1px solid #e2e8f0',borderRadius:'16px',overflow:'hidden',marginBottom:'12px',background:'white'}}>
      {editing ? (
        <div style={{padding:'16px',background:'#f0f9ff'}}>
          <div style={{display:'flex',gap:'8px',marginBottom:'8px'}}>
            <select value={form.task_type} onChange={e => setForm({...form, task_type: e.target.value})} style={{padding:'8px',borderRadius:'8px',border:'1px solid #e2e8f0',fontSize:'13px'}}>
              <option value="tache3">🗣️ Tâche 3</option>
              <option value="tache2">🎤 Tâche 2</option>
            </select>
            <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} style={{padding:'8px',borderRadius:'8px',border:'1px solid #e2e8f0',fontSize:'13px'}}>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
            </select>
            <select value={form.theme} onChange={e => setForm({...form, theme: e.target.value})} style={{flex:1,padding:'8px',borderRadius:'8px',border:'1px solid #e2e8f0',fontSize:'13px'}}>
              {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <textarea value={form.question} onChange={e => setForm({...form, question: e.target.value})} rows={3} style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e2e8f0',marginBottom:'8px',fontSize:'14px',boxSizing:'border-box',resize:'vertical'}} />
          <div style={{display:'flex',gap:'8px'}}>
            <button onClick={saveTopic} style={{flex:1,padding:'10px',background:'#0ea5e9',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:700}}>✅ Sauver</button>
            <button onClick={() => setEditing(false)} style={{flex:1,padding:'10px',background:'#f1f5f9',border:'none',borderRadius:'8px',cursor:'pointer'}}>Annuler</button>
          </div>
        </div>
      ) : (
        <div style={{padding:'16px',display:'flex',alignItems:'flex-start',gap:'12px'}}>
          <div style={{flex:1,cursor:'pointer'}} onClick={toggleExpand}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
              <span style={{fontSize:'12px',padding:'2px 8px',borderRadius:'6px',fontWeight:700,background:topic.task_type==='tache3'?'#f0fdf4':'#fdf4ff',color:topic.task_type==='tache3'?'#16a34a':'#9333ea'}}>
                {topic.task_type === 'tache3' ? '🗣️ T3' : '🎤 T2'}
              </span>
              <span style={{fontSize:'12px',padding:'2px 8px',borderRadius:'6px',fontWeight:700,background:topic.difficulty==='B2'?'#ede9fe':'#e0f2fe',color:topic.difficulty==='B2'?'#7c3aed':'#0369a1'}}>{topic.difficulty}</span>
              <span style={{fontSize:'12px',color:'#64748b'}}>{topic.theme}</span>
            </div>
            <p style={{margin:0,fontSize:'14px',fontWeight:600,color:'#0f172a',lineHeight:'1.4'}}>{topic.question}</p>
          </div>
          <div style={{display:'flex',gap:'4px',flexShrink:0}}>
            <button onClick={() => setEditing(true)} style={{padding:'6px 10px',background:'#fef9c3',border:'none',borderRadius:'8px',cursor:'pointer'}}>✏️</button>
            <button onClick={() => onDelete(topic.id)} style={{padding:'6px 10px',background:'#fee2e2',border:'none',borderRadius:'8px',cursor:'pointer'}}>🗑️</button>
          </div>
        </div>
      )}
      {expanded && (
        <div style={{padding:'0 16px 16px',borderTop:'1px solid #f1f5f9'}}>
          <p style={{margin:'12px 0 8px',fontSize:'13px',fontWeight:700,color:'#64748b'}}>💡 Idées ({ideas.length})</p>
          {loadingIdeas ? <p style={{color:'#94a3b8',fontSize:'13px'}}>Chargement...</p> : ideas.map(idea => (
            <IdeaRow key={idea.id} idea={idea} onDelete={deleteIdea} onUpdate={updated => setIdeas(ideas.map(i => i.id === updated.id ? updated : i))} />
          ))}
          <AddIdeaForm topicId={topic.id} onAdd={idea => setIdeas([...ideas, idea])} />
        </div>
      )}
      {!editing && (
        <button onClick={toggleExpand} style={{width:'100%',padding:'8px',background:'#f8fafc',border:'none',borderTop:'1px solid #f1f5f9',cursor:'pointer',fontSize:'12px',color:'#94a3b8'}}>
          {expanded ? '▲ Masquer' : '▼ Voir / ajouter des idées'}
        </button>
      )}
    </div>
  )
}

function AddTopicForm({ onAdd }: { onAdd: (t: Topic) => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ task_type: 'tache3', question: '', theme: 'Technologie', difficulty: 'B1' })
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!form.question.trim()) return
    setLoading(true)
    const res = await fetch('/api/admin/topics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.topic) { onAdd(data.topic); setForm({ task_type: 'tache3', question: '', theme: 'Technologie', difficulty: 'B1' }); setOpen(false) }
    setLoading(false)
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{width:'100%',padding:'16px',background:'#0ea5e9',color:'white',border:'none',borderRadius:'16px',cursor:'pointer',fontWeight:700,fontSize:'16px',marginBottom:'16px'}}>
      ➕ Ajouter un nouveau sujet
    </button>
  )

  return (
    <div style={{background:'#f0f9ff',border:'2px solid #0ea5e9',borderRadius:'16px',padding:'16px',marginBottom:'16px'}}>
      <p style={{margin:'0 0 12px',fontWeight:700,fontSize:'16px',color:'#0ea5e9'}}>➕ Nouveau sujet</p>
      <div style={{display:'flex',gap:'8px',marginBottom:'10px'}}>
        <select value={form.task_type} onChange={e => setForm({...form, task_type: e.target.value})} style={{flex:1,padding:'10px',borderRadius:'10px',border:'1px solid #bae6fd',fontSize:'14px',background:'white'}}>
          <option value="tache3">🗣️ Tâche 3 — Monologue</option>
          <option value="tache2">🎤 Tâche 2 — Interview</option>
        </select>
        <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} style={{padding:'10px',borderRadius:'10px',border:'1px solid #bae6fd',fontSize:'14px',background:'white'}}>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
        </select>
      </div>
      <select value={form.theme} onChange={e => setForm({...form, theme: e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #bae6fd',marginBottom:'10px',fontSize:'14px',background:'white',boxSizing:'border-box'}}>
        {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <textarea value={form.question} onChange={e => setForm({...form, question: e.target.value})} placeholder="Question du sujet..." rows={3} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #bae6fd',marginBottom:'10px',fontSize:'14px',boxSizing:'border-box',resize:'vertical',background:'white'}} />
      <div style={{display:'flex',gap:'8px'}}>
        <button onClick={submit} disabled={loading || !form.question.trim()} style={{flex:1,padding:'12px',background:loading?'#94a3b8':'#0ea5e9',color:'white',border:'none',borderRadius:'10px',cursor:'pointer',fontWeight:700,fontSize:'15px'}}>
          {loading ? '⏳...' : '✅ Créer'}
        </button>
        <button onClick={() => setOpen(false)} style={{padding:'12px 16px',background:'#f1f5f9',border:'none',borderRadius:'10px',cursor:'pointer',fontWeight:600}}>Annuler</button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all'|'tache2'|'tache3'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => { loadTopics() }, [])

  async function loadTopics() {
    setLoading(true)
    const res = await fetch('/api/admin/topics')
    const data = await res.json()
    setTopics(data.topics ?? [])
    setLoading(false)
  }

  async function deleteTopic(id: string) {
    if (!confirm('Supprimer ce sujet ?')) return
    await fetch('/api/admin/topics?id=' + id, { method: 'DELETE' })
    setTopics(topics.filter(t => t.id !== id))
  }

  const filtered = topics
    .filter(t => filter === 'all' || t.task_type === filter)
    .filter(t => !search || t.question.toLowerCase().includes(search.toLowerCase()) || t.theme.toLowerCase().includes(search.toLowerCase()))

  const t3 = topics.filter(t => t.task_type === 'tache3').length
  const t2 = topics.filter(t => t.task_type === 'tache2').length

  return (
    <div style={{maxWidth:'680px',margin:'0 auto',padding:'16px',fontFamily:'system-ui,sans-serif',background:'#f8fafc',minHeight:'100vh'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
        <div>
          <h1 style={{margin:0,fontSize:'24px',fontWeight:800,color:'#0f172a'}}>⚙️ Admin</h1>
          <p style={{margin:'4px 0 0',fontSize:'13px',color:'#64748b'}}>{t3} sujets Tâche 3 · {t2} sujets Tâche 2</p>
        </div>
        <a href="/daily" style={{padding:'8px 16px',background:'#0f172a',color:'white',borderRadius:'10px',textDecoration:'none',fontSize:'13px',fontWeight:600}}>← App</a>
      </div>
      <AddTopicForm onAdd={t => setTopics([t, ...topics])} />
      <div style={{display:'flex',gap:'8px',marginBottom:'12px',flexWrap:'wrap'}}>
        {(['all','tache3','tache2'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{padding:'8px 14px',borderRadius:'10px',border:'none',cursor:'pointer',fontWeight:600,fontSize:'13px',background:filter===f?'#0f172a':'#e2e8f0',color:filter===f?'white':'#64748b'}}>
            {f==='all'?'Tous ('+topics.length+')':f==='tache3'?'🗣️ T3 ('+t3+')':'🎤 T2 ('+t2+')'}
          </button>
        ))}
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Rechercher..." style={{width:'100%',padding:'10px 14px',borderRadius:'12px',border:'1px solid #e2e8f0',marginBottom:'16px',fontSize:'14px',boxSizing:'border-box',background:'white'}} />
      {loading ? (
        <div style={{textAlign:'center',padding:'40px',color:'#94a3b8'}}><div style={{fontSize:'32px'}}>⏳</div><p>Chargement...</p></div>
      ) : filtered.map(topic => (
        <TopicCard key={topic.id} topic={topic} onDelete={deleteTopic} onUpdate={updated => setTopics(topics.map(t => t.id === updated.id ? updated : t))} />
      ))}
    </div>
  )
}
