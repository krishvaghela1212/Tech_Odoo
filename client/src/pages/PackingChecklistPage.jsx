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

  const categories = ['All', 'Clothing', 'Documents', 'Electronics', 'Toiletries', 'Gear', 'Misc']

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

  const togglePacked = (item) => {
    // Optimistic Update
    const originalItems = [...items]
    const newPackedStatus = !item.is_packed
    
    setItems(items.map(i => i.id === item.id ? { ...i, is_packed: newPackedStatus } : i))

    supabase.from('checklist_items')
      .update({ is_packed: newPackedStatus })
      .eq('id', item.id)
      .then(({ error }) => {
        if (error) {
          console.error(error)
          setItems(originalItems) // Rollback on error
        }
      })
  }

  const addSmartItem = async (label, category) => {
    if (items.some(i => i.label.toLowerCase() === label.toLowerCase())) return
    
    try {
      const { data, error } = await supabase.from('checklist_items').insert([{
        trip_id: tripId,
        label: label,
        category: category
      }]).select().single()
      
      if (error) throw error
      setItems(prev => [...prev, data])
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
      case 'Toiletries': return <Plus size={14} />
      case 'Gear': return <Package size={14} />
      default: return <Tag size={14} />
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] bg-[var(--color-bg)]">
      <Loader2 className="animate-spin text-[var(--color-primary)] mb-4" size={48} />
      <p className="text-[var(--color-text-muted)] animate-pulse font-display text-xl uppercase tracking-widest">Organizing your bag...</p>
    </div>
  )

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl pb-24 bg-[var(--color-bg)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4 hover:gap-3 transition-all">
            <ArrowLeft size={14} /> Back to Itinerary
          </button>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-[var(--color-secondary)] italic">Packing Checklist</h1>
        </div>
        <button 
          onClick={resetAll}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all bg-[var(--color-surface)] px-6 py-3 rounded-2xl group border border-[var(--color-border)] shadow-xl"
        >
          <RotateCcw size={16} className="group-hover:-rotate-90 transition-transform" /> Reset Checklist
        </button>
      </div>

      {/* Progress Bar */}
      <div className="card shadow-2xl p-10 mb-12 border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent-soft)] opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="flex justify-between items-end mb-6 relative z-10">
          <div>
            <h3 className="font-display text-3xl font-bold text-[var(--color-secondary)] mb-1">Your Progress</h3>
            <p className="text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-widest">Ready for takeoff?</p>
          </div>
          <span className="font-display font-bold text-[var(--color-accent)] text-3xl tracking-tighter">{packedCount}<span className="text-lg opacity-40 mx-1">/</span>{items.length}</span>
        </div>
        <div className="w-full h-4 bg-[var(--color-bg)] rounded-full overflow-hidden border border-[var(--color-border)] shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] shadow-[0_0_20px_rgba(212,168,67,0.4)]"
          />
        </div>
        <p className="text-sm text-[var(--color-text-muted)] mt-6 font-medium italic relative z-10">
          {progressPercent === 100 ? '🎉 You are fully packed and ready for the adventure of a lifetime!' : 'Precision packing leads to a stress-free journey.'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left Side - Add Item */}
        <div className="lg:w-1/3">
          <div className="sticky top-24 space-y-10">
            <div className="card shadow-2xl border-[var(--color-border)] bg-[var(--color-surface)] p-8">
              <h4 className="font-display text-xl font-bold text-[var(--color-secondary)] mb-8 flex items-center gap-3 italic">
                <Plus className="text-[var(--color-primary)]" /> Add Item
              </h4>
              <form onSubmit={handleAddItem} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3 ml-1">Item Name</label>
                  <input 
                    type="text" 
                    placeholder="Sunglasses, Charger..." 
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4 text-[var(--color-text)] font-bold focus:outline-none focus:border-[var(--color-primary)] transition-all"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3 ml-1">Category</label>
                  <select 
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4 text-[var(--color-text)] font-bold focus:outline-none focus:border-[var(--color-primary)] transition-all appearance-none"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={isAdding}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-3 shadow-xl hover:shadow-[var(--color-primary)]/20 transition-all"
                >
                  {isAdding ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Add to List</>}
                </button>
              </form>

              {/* Smart Suggestions Chips */}
              <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">Smart Essentials</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { l: 'Passport', c: 'Documents' },
                    { l: 'Universal Adapter', c: 'Electronics' },
                    { l: 'Sunscreen', c: 'Toiletries' },
                    { l: 'First Aid Kit', c: 'Misc' },
                    { l: 'Power Bank', c: 'Electronics' },
                    { l: 'Insurance Policy', c: 'Documents' }
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => addSmartItem(s.l, s.c)}
                      className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-all active:scale-95"
                    >
                      + {s.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden lg:block p-8 bg-[var(--color-secondary)] text-[var(--color-bg)] rounded-[2.5rem] overflow-hidden relative shadow-2xl group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Package size={120} />
              </div>
              <p className="text-[var(--color-primary)] font-display text-2xl font-bold mb-3 italic">Travel Protocol</p>
              <p className="text-sm text-[var(--color-bg)]/80 leading-relaxed font-medium">Roll your clothing instead of folding to maximize spatial efficiency and reduce creases.</p>
            </div>
          </div>
        </div>

        {/* Right Side - List */}
        <div className="lg:w-2/3">
          <div className="flex bg-[var(--color-surface)] p-2 rounded-2xl mb-10 border border-[var(--color-border)] shadow-xl overflow-x-auto scrollbar-hide">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveTab(c)}
                className={`flex-1 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                  activeTab === c 
                    ? 'bg-[var(--color-primary)] text-[var(--color-bg)] shadow-lg' 
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.length > 0 ? [...filteredItems].sort((a,b) => (a.is_packed === b.is_packed) ? 0 : a.is_packed ? 1 : -1).map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={item.id}
                  className={`card p-6 flex items-center justify-between border-[var(--color-border)] shadow-lg hover:shadow-xl transition-all group ${
                    item.is_packed ? 'bg-[var(--color-bg)]/40 opacity-50' : 'bg-[var(--color-surface)]'
                  }`}
                >
                  <div className="flex items-center gap-6 flex-1 cursor-pointer" onClick={() => togglePacked(item)}>
                    <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                      item.is_packed 
                        ? 'bg-[var(--color-primary)] border-[var(--color-primary)] rotate-12' 
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                    }`}>
                      {item.is_packed && <CheckSquare className="text-[var(--color-bg)]" size={18} />}
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-display text-xl font-bold text-[var(--color-secondary)] transition-all ${item.is_packed ? 'line-through opacity-40' : ''}`}>
                        {item.label}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-[0.1em] text-[var(--color-primary)] mt-1 opacity-70">
                         {getCategoryIcon(item.category)} {item.category}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                    className="p-3 text-[var(--color-text-muted)] hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              )) : (
                <div className="text-center py-32 bg-[var(--color-surface)] shadow-inner rounded-[3rem] border-2 border-dashed border-[var(--color-border)]">
                  <Package className="mx-auto text-[var(--color-border)] mb-6 opacity-20" size={80} />
                  <p className="text-[var(--color-text-muted)] font-display text-xl italic">The archive is currently empty.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
