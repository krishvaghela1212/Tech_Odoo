import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'motion/react'
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  RotateCcw, 
  ArrowLeft, 
  Loader2, 
  Package,
  ShoppingBag,
  FileText,
  Smartphone,
  Tag
} from 'lucide-react'

export default function PackingChecklistPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [newLabel, setNewLabel] = useState('')
  const [newCategory, setNewCategory] = useState('Misc')
  const [activeTab, setActiveTab] = useState('All')
  const [isAdding, setIsAdding] = useState(false)

  const categories = ['All', 'Clothing', 'Documents', 'Electronics', 'Misc']

  useEffect(() => {
    fetchChecklist()

    const channel = supabase
      .channel('checklist-channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'checklist_items',
        filter: `trip_id=eq.${tripId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setItems(prev => [...prev, payload.new])
        }
        if (payload.eventType === 'DELETE') {
          setItems(prev => prev.filter(i => i.id !== payload.old.id))
        }
        if (payload.eventType === 'UPDATE') {
          setItems(prev => prev.map(i => i.id === payload.new.id ? payload.new : i))
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [tripId])

  const fetchChecklist = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('checklist_items').select('*').eq('trip_id', tripId).order('created_at', { ascending: true })
      if (error) throw error
      setItems(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!newLabel) return
    
    setIsAdding(true)
    try {
      const { data, error } = await supabase.from('checklist_items').insert([{
        trip_id: tripId,
        label: newLabel,
        category: newCategory
      }]).select().single()
      
      if (error) throw error
      setItems([...items, data])
      setNewLabel('')
    } catch (err) {
      console.error(err)
    } finally {
      setIsAdding(false)
    }
  }

  const togglePacked = async (item) => {
    try {
      const { error } = await supabase.from('checklist_items').update({ is_packed: !item.is_packed }).eq('id', item.id)
      if (error) throw error
      setItems(items.map(i => i.id === item.id ? { ...i, is_packed: !item.is_packed } : i))
    } catch (err) {
      console.error(err)
    }
  }

  const deleteItem = async (id) => {
    try {
      await supabase.from('checklist_items').delete().eq('id', id)
      setItems(items.filter(i => i.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const resetAll = async () => {
    if (!window.confirm('Mark everything as unpacked?')) return
    try {
      await supabase.from('checklist_items').update({ is_packed: false }).eq('trip_id', tripId)
      setItems(items.map(i => ({ ...i, is_packed: false })))
    } catch (err) {
      console.error(err)
    }
  }

  const filteredItems = items.filter(item => activeTab === 'All' || item.category === activeTab)
  const packedCount = items.filter(i => i.is_packed).length
  const progressPercent = items.length > 0 ? (packedCount / items.length) * 100 : 0

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Clothing': return <ShoppingBag size={14} />
      case 'Documents': return <FileText size={14} />
      case 'Electronics': return <Smartphone size={14} />
      default: return <Tag size={14} />
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)]">
      <Loader2 className="animate-spin text-[var(--color-primary)] mb-4" size={48} />
      <p className="text-[var(--color-text-muted)] animate-pulse font-display text-xl">Organizing your bag...</p>
    </div>
  )

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4 hover:gap-3 transition-all">
            <ArrowLeft size={14} /> Back to Itinerary
          </button>
          <h1 className="font-display text-5xl font-bold text-[var(--color-secondary)] underline decoration-[var(--color-accent)] decoration-4 underline-offset-8">Packing Checklist</h1>
        </div>
        <button 
          onClick={resetAll}
          className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all bg-[var(--color-bg)] px-4 py-2 rounded-xl group"
        >
          <RotateCcw size={16} className="group-hover:-rotate-90 transition-transform" /> Reset Checklist
        </button>
      </div>

      {/* Progress Bar */}
      <div className="card shadow-lg p-8 mb-10 border-[var(--color-border)]">
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-display text-2xl font-bold text-[var(--color-secondary)]">Your Progress</h3>
          <span className="font-bold text-[var(--color-accent)] text-lg">{packedCount} of {items.length} items</span>
        </div>
        <div className="w-full h-4 bg-[var(--color-bg)] rounded-full overflow-hidden border border-[var(--color-border)]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-[var(--color-accent)] shadow-[0_0_10px_rgba(212,168,67,0.5)]"
          />
        </div>
        <p className="text-sm text-[var(--color-text-muted)] mt-4 font-medium italic">
          {progressPercent === 100 ? '🎉 You are fully packed and ready to go!' : 'Don\'t forget those document essentials!'}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Left Side - Add Item */}
        <div className="md:w-1/3">
          <div className="sticky top-24 space-y-8">
            <div className="card shadow-md border-[var(--color-border)]">
              <h4 className="font-display text-xl font-bold text-[var(--color-secondary)] mb-6 flex items-center gap-2">
                <Plus className="text-[var(--color-primary)]" /> Add Item
              </h4>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Item Name</label>
                  <input 
                    type="text" 
                    placeholder="Sunglasses, Charger..." 
                    className="input-field"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Category</label>
                  <select 
                    className="input-field"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={isAdding}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2 shadow-lg"
                >
                  {isAdding ? <Loader2 className="animate-spin" /> : 'Add to List'}
                </button>
              </form>
            </div>

            <div className="hidden md:block p-6 bg-[var(--color-secondary)] text-white rounded-3xl overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Package size={80} />
              </div>
              <p className="text-[var(--color-accent)] font-bold text-lg mb-2">Pro Tip:</p>
              <p className="text-sm text-white/70 leading-relaxed font-light">Roll your clothes instead of folding them to save space and reduce wrinkles!</p>
            </div>
          </div>
        </div>

        {/* Right Side - List */}
        <div className="md:w-2/3">
          <div className="flex bg-white/50 p-1 rounded-xl mb-8 border border-[var(--color-border)] ring-1 ring-white/50 backdrop-blur">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveTab(c)}
                className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === c 
                    ? 'bg-white text-[var(--color-primary)] shadow-md' 
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredItems.length > 0 ? [...filteredItems].sort((a,b) => (a.is_packed === b.is_packed) ? 0 : a.is_packed ? 1 : -1).map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item.id}
                  className={`card p-4 flex items-center justify-between border-[var(--color-border)] shadow-sm hover:shadow-md transition-all group ${
                    item.is_packed ? 'bg-[var(--color-bg)]/50 opacity-60' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => togglePacked(item)}>
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      item.is_packed 
                        ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' 
                        : 'border-[var(--color-border)]'
                    }`}>
                      {item.is_packed && <CheckSquare className="text-white" size={14} />}
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-bold text-[var(--color-secondary)] transition-all ${item.is_packed ? 'line-through text-[var(--color-text-muted)]' : ''}`}>
                        {item.label}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-[0.05em] text-[var(--color-text-muted)] mt-0.5">
                         {getCategoryIcon(item.category)} {item.category}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-gray-300 hover:text-[var(--color-danger)] transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              )) : (
                <div className="text-center py-20 bg-white shadow-inner rounded-3xl border-2 border-dashed border-[var(--color-border)]">
                  <Package className="mx-auto text-[var(--color-border)] mb-4" size={48} />
                  <p className="text-[var(--color-text-muted)] italic">No items in this category.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
