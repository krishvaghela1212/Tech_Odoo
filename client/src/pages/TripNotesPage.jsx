import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Loader2, 
  StickyNote, 
  Save, 
  X, 
  Clock, 
  MapPin,
  Edit3
} from 'lucide-react'

export default function TripNotesPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  
  const [notes, setNotes] = useState([])
  const [stops, setStops] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [content, setContent] = useState('')
  const [selectedStopId, setSelectedStopId] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchData()

    const channel = supabase
      .channel('notes-channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'trip_notes',
        filter: `trip_id=eq.${tripId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setNotes(prev => [...prev, payload.new])
        }
        if (payload.eventType === 'DELETE') {
          setNotes(prev => prev.filter(i => i.id !== payload.old.id))
        }
        if (payload.eventType === 'UPDATE') {
          setNotes(prev => prev.map(i => i.id === payload.new.id ? payload.new : i))
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [tripId])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: notesData, error: notesError } = await supabase.from('trip_notes').select('*').eq('trip_id', tripId).order('created_at', { ascending: false })
      const { data: stopsData, error: stopsError } = await supabase.from('stops').select('*').eq('trip_id', tripId).order('order_index', { ascending: true })
      
      if (notesError || stopsError) throw notesError || stopsError
      
      setNotes(notesData || [])
      setStops(stopsData || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!content) return
    
    setSaving(true)
    try {
      if (editingId) {
        const { data, error } = await supabase.from('trip_notes').update({
          content,
          stop_id: selectedStopId || null,
          updated_at: new Date()
        }).eq('id', editingId).select().single()
        
        if (error) throw error
        setNotes(notes.map(n => n.id === editingId ? data : n))
      } else {
        const { data, error } = await supabase.from('trip_notes').insert([{
          trip_id: tripId,
          stop_id: selectedStopId || null,
          content
        }]).select().single()
        
        if (error) throw error
        setNotes([data, ...notes])
      }
      
      handleCloseForm()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const deleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return
    try {
      await supabase.from('trip_notes').delete().eq('id', id)
      setNotes(notes.filter(n => n.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const startEdit = (note) => {
    setEditingId(note.id)
    setContent(note.content)
    setSelectedStopId(note.stop_id || '')
    setIsAdding(true)
  }

  const handleCloseForm = () => {
    setIsAdding(false)
    setEditingId(null)
    setContent('')
    setSelectedStopId('')
  }

  const getStopName = (stopId) => {
    return stops.find(s => s.id === stopId)?.city_name || 'General'
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)]">
      <Loader2 className="animate-spin text-[var(--color-primary)] mb-4" size={48} />
      <p className="text-[var(--color-text-muted)] animate-pulse font-display text-xl">Recollecting your thoughts...</p>
    </div>
  )

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4 hover:gap-3 transition-all">
            <ArrowLeft size={14} /> Back to Itinerary
          </button>
          <h1 className="font-display text-5xl font-bold text-[var(--color-secondary)] underline decoration-[var(--color-accent)] decoration-4 underline-offset-8">Trip Journal</h1>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center gap-2 shadow-xl hover:scale-105"
        >
          <Plus size={20} /> Add Note
        </button>
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {notes.length > 0 ? notes.map((note) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={note.id}
              className="card bg-white p-8 border-[var(--color-border)] shadow-md hover:shadow-xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-accent)] opacity-40"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] bg-[var(--color-bg)] px-3 py-1.5 rounded-full">
                    <Clock size={12} className="text-[var(--color-primary)]" />
                    {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {note.stop_id && (
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-secondary)] bg-[var(--color-primary-soft)] px-3 py-1.5 rounded-full">
                      <MapPin size={12} />
                      {getStopName(note.stop_id)}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEdit(note)}
                    className="p-2 text-gray-300 hover:text-[var(--color-primary)] transition-all bg-[var(--color-bg)] rounded-xl"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="p-2 text-gray-300 hover:text-[var(--color-danger)] transition-all bg-[var(--color-bg)] rounded-xl"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="prose prose-stone max-w-none">
                <p className="text-[var(--color-text)] text-lg leading-relaxed whitespace-pre-wrap font-body">
                  {note.content}
                </p>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-24 bg-white/50 rounded-3xl border-2 border-dashed border-[var(--color-border)] shadow-inner">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--color-border)] shadow-sm">
                <StickyNote size={40} />
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-secondary)] mb-2">No notes yet</h3>
              <p className="text-[var(--color-text-muted)] mb-8 max-w-xs mx-auto">Capture your favorite memories, flight info, or local tips for later!</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="btn-outline px-10"
              >
                Create Your First Note
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Slide-in Note Form Overlay */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white rounded-t-3xl md:rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={handleCloseForm}
                className="absolute top-6 right-6 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-2"
              >
                <X size={24} />
              </button>

              <h2 className="font-display text-3xl font-bold text-[var(--color-secondary)] mb-2">
                {editingId ? 'Edit Note' : 'New Journal Entry'}
              </h2>
              <p className="text-[var(--color-text-muted)] mb-8 italic">Capture the details of your adventure.</p>

              <form onSubmit={handleAddNote} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Which stop is this for? (Optional)</label>
                  <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    {stops.map(stop => (
                      <button
                        key={stop.id}
                        type="button"
                        onClick={() => setSelectedStopId(selectedStopId === stop.id ? '' : stop.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                          selectedStopId === stop.id 
                            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md' 
                            : 'bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary-soft)]'
                        }`}
                      >
                        {stop.city_name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Your Note</label>
                  <textarea 
                    autoFocus
                    required
                    rows={8}
                    className="input-field text-lg leading-relaxed resize-none p-5"
                    placeholder="Describe your day, your feelings, or any interesting encounters..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={handleCloseForm}
                    className="flex-1 px-6 py-4 rounded-xl border border-[var(--color-border)] font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving || !content}
                    className="flex-[2] btn-primary py-4 text-lg shadow-xl flex items-center justify-center gap-2 group"
                  >
                    {saving ? <Loader2 className="animate-spin" /> : (
                      <>
                        <Save size={20} className="group-hover:scale-110 transition-transform" /> 
                        {editingId ? 'Update Entry' : 'Save Entry'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
