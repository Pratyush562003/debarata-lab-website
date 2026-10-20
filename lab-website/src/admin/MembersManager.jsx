import { useState } from 'react'
import { useLabData } from '../context/LabDataContext'
import { useConfirm } from '../context/ConfirmModalContext'

const inputStyle = { width: '100%', padding: '0.6rem 0.9rem', border: '1px solid var(--gray-200)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', boxSizing: 'border-box' }

export default function MembersManager() {
  const { members, setMembers, addMember, updateMember, deleteMember } = useLabData()
  const confirm = useConfirm()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({})
  const emptyForm = { name: '', role: 'Research Scholar', project: '', email: '', linkedin: '' }

  const normalizeRole = (role) => {
    if (role === 'Postdoctoral Researcher' || role === 'PhD Student' || role === 'Project Fellow') {
      return 'Research Scholar'
    }
    return role || 'Research Scholar'
  }

  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  const startDrag = (index) => {
    setDraggedIndex(index)
  }

  const dragOver = (e) => {
    e.preventDefault()
  }

  const drop = (targetIndex) => {
    if (draggedIndex === null) return
    if (draggedIndex === targetIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    setMembers(prev => {
      const list = [...prev]
      const [moved] = list.splice(draggedIndex, 1)
      list.splice(targetIndex, 0, moved)
      return list
    })

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const startAdd = () => { setForm(emptyForm); setAdding(true); setEditing(null) }
  const startEdit = (m) => { setForm({ ...m, role: normalizeRole(m.role) }); setEditing(m.id); setAdding(false) }
  const cancel = () => { setEditing(null); setAdding(false) }

  const save = async () => {
    setIsSaving(true)
    try {
      if (adding) {
        if (addMember) {
          await addMember(form)
        } else {
          setMembers(ms => [...ms, { ...form, id: Date.now() }])
        }
      } else {
        if (updateMember) {
          await updateMember(editing, form)
        } else {
          setMembers(ms => ms.map(m => m.id === editing ? { ...form, id: editing } : m))
        }
      }
      cancel()
    } finally {
      setIsSaving(false)
    }
  }

  const del = async (id) => {
    const ok = await confirm({
      title: 'Remove Member?',
      message: 'Do you want to remove this member? This action cannot be undone.',
      confirmText: 'Yes',
      cancelText: 'No'
    })
    if (!ok) return

    if (deleteMember) {
      await deleteMember(id)
    } else {
      setMembers(ms => ms.filter(m => m.id !== id))
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--navy)' }}>Lab Members</h2>
        <button onClick={startAdd} className="btn btn-primary">+ Add Member</button>
      </div>

      {(adding || editing) && (
        <div style={{ background: 'var(--off-white)', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem', color: 'var(--navy)' }}>{adding ? 'Add' : 'Edit'} Member</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[['name', 'Full Name'], ['email', 'Email'], ['project', 'Research Project'], ['linkedin', 'LinkedIn URL']].map(([key, label]) => (
              <div key={key}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: '0.3rem' }}>{label}</label>
                <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1px solid var(--gray-200)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: '0.3rem' }}>Role</label>
              <select value={form.role || 'Research Scholar'} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1px solid var(--gray-200)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
                <option value="Research Scholar">Research Scholar</option>
                <option value="Masters Student">Masters Student</option>
                <option value="Bachelor Student">Bachelor Student</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button onClick={save} className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving to Firebase...' : 'Save'}
            </button>
            <button onClick={cancel} className="btn btn-outline" disabled={isSaving}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {members.map((m, idx) => (
          <div key={m.id} 
            draggable
            onDragStart={() => startDrag(idx)}
            onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
            onDragOver={dragOver}
            onDrop={() => drop(idx)}
            onDragEnter={() => setDragOverIndex(idx)}
            onDragLeave={() => setDragOverIndex(null)}
            style={{ 
              background: dragOverIndex === idx ? 'rgba(201,168,76,0.1)' : '#fff', 
              border: '1px solid var(--gray-200)', 
              borderRadius: '10px', 
              padding: '1.25rem',
              opacity: draggedIndex === idx ? 0.4 : 1,
              transition: 'background-color 0.2s',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <div 
                  style={{
                    cursor: 'grab',
                    fontSize: '1.1rem',
                    color: 'var(--gray-400)',
                    userSelect: 'none',
                    marginTop: '2px'
                  }}
                >
                  ⋮⋮
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: '0.25rem' }}>{m.name}</div>
                  <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>{m.role}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => startEdit(m)} style={{ padding: '0.3rem 0.6rem', border: '1px solid var(--gray-200)', borderRadius: '5px', background: '#fff', cursor: 'pointer', fontSize: '0.78rem' }}>Edit</button>
                <button onClick={() => del(m.id)} style={{ padding: '0.3rem 0.6rem', border: '1px solid #fee2e2', borderRadius: '5px', background: '#fff', color: '#b91c1c', cursor: 'pointer', fontSize: '0.78rem' }}>✕</button>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '0.75rem', lineHeight: 1.5 }}>{m.project}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--blue)', marginTop: '0.5rem' }}>{m.email}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
