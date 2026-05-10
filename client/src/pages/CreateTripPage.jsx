import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { motion } from 'motion/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Image as ImageIcon, 
  Globe, 
  Loader2, 
  ArrowLeft,
  Info,
  Camera,
  Eye,
  Plus
} from 'lucide-react'

export default function CreateTripPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [coverUrl, setCoverUrl] = useState('')
  const [budget, setBudget] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [imgError, setImgError] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCreate = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  try {
    const { data, error: insertError } = await supabase
      .from('trips')
      .insert([{
        user_id: user?.id,
        name,
        description,
        start_date: startDate ? startDate.toISOString().split('T')[0] : null,
        end_date: endDate ? endDate.toISOString().split('T')[0] : null,
        cover_photo_url: coverUrl || null,
        total_budget: budget ? parseFloat(budget) : 0,
        is_public: isPublic
      }])
      .select()
      .single()

    if (insertError) throw insertError
    navigate(`/trips/${data.id}/builder`)
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24 md:pb-32">
      {/* Dark Cinematic Header */}
      <div className="relative h-[300px] md:h-[380px] flex items-start overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg)] via-[var(--color-surface)] to-black z-10 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80')] bg-cover bg-center opacity-20"></div>
        
        <div className="container mx-auto px-6 relative z-20 pt-24 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-8 hover:opacity-70 transition-all group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-black text-[var(--color-secondary)] italic tracking-tighter leading-tight mb-3 md:mb-4 drop-shadow-sm">
              {name || 'New Adventure'}
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm md:text-xl italic opacity-80 max-w-2xl font-medium">
              Every great journey begins with a single step. Define your path and start the discovery.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-16 md:-mt-20 relative z-30">
        <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Left - Form Fields */}
          <div className="lg:col-span-2 space-y-8 md:space-y-10">
            <section className="card p-6 md:p-10 bg-[var(--color-surface)] border-[var(--color-border)] shadow-2xl">
              <div className="flex items-center gap-3 mb-8 md:mb-10">
                <div className="p-3 bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded-2xl">
                  <Info size={24} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-[var(--color-text)]">Trip Details</h3>
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest font-bold">The Core Essence</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-6 mb-10 rounded-2xl flex items-center gap-4 text-red-400">
                  <Info size={20} />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3 ml-1">Trip Name</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                    <input 
                      type="text" 
                      required 
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl pl-14 py-5 text-[var(--color-text)] font-bold focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]/20 transition-all text-lg" 
                      placeholder="e.g. Kyoto Cherry Blossom Tour"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3 ml-1">Short Description</label>
                  <textarea 
                    rows={5}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-6 text-[var(--color-text)] font-medium focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]/20 transition-all resize-none" 
                    placeholder="What are you hoping to experience on this journey?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="card p-10 bg-[var(--color-surface)] border-[var(--color-border)] shadow-2xl">
              <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-[var(--color-accent-soft)] text-[var(--color-accent)] rounded-2xl">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-[var(--color-text)]">Timing & Budget</h3>
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest font-bold">Logistics & Limits</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3 ml-1">Start Date</label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        placeholderText="Select start"
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4 text-[var(--color-text)] font-bold focus:outline-none focus:border-[var(--color-primary)]"
                        dateFormat="MMM d, yyyy"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3 ml-1">End Date</label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        placeholderText="Select end"
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4 text-[var(--color-text)] font-bold focus:outline-none focus:border-[var(--color-primary)]"
                        minDate={startDate || undefined}
                        dateFormat="MMM d, yyyy"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3 ml-1">Total Budget ($)</label>
                    <div className="relative group">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                      <input 
                        type="number" 
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl pl-14 py-5 text-[var(--color-text)] font-bold focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]/20 transition-all text-lg" 
                        placeholder="5000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right - Preview & Visibility */}
          <div className="space-y-10">
            <section className="card p-10 bg-[var(--color-surface)] border-[var(--color-border)] shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded-2xl">
                  <Camera size={24} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-[var(--color-text)]">Visual Context</h3>
                </div>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3 ml-1">Cover Photo URL</label>
                  <div className="relative group">
                    <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                    <input 
                      type="url" 
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl pl-14 py-5 text-[var(--color-text)] font-medium focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]/20 transition-all" 
                      placeholder="e.g. https://images.unsplash.com/photo-123..."
                      value={coverUrl}
                      onChange={(e) => {
                        setCoverUrl(e.target.value);
                        setImgError(false);
                      }}
                    />
                  </div>
                  <p className="mt-4 text-[10px] text-[var(--color-text-muted)] italic leading-relaxed px-1">
                    <span className="text-[var(--color-primary)] font-bold">Pro Tip:</span> Right-click any image you like on the web and select <span className="text-white">"Copy Image Address"</span> to get the perfect link.
                  </p>
                </div>

                <div className="aspect-video w-full rounded-3xl bg-[var(--color-bg)] border border-[var(--color-border)] overflow-hidden relative shadow-inner group">
                  {coverUrl && !imgError ? (
                    <img 
                      src={coverUrl} 
                      className="w-full h-full object-cover animate-in fade-in duration-700" 
                      alt="Preview" 
                      onError={() => setImgError(true)}
                    />
                  ) : coverUrl && imgError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-red-500/5">
                      <ImageIcon size={48} className="text-red-400/40 mb-4" />
                      <p className="text-xs font-bold text-red-400/60 mb-2">Invalid Image Link</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] italic">
                        This looks like a web page link. Please right-click the image itself and select "Copy Image Address".
                      </p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-text-muted)] opacity-30 p-6 text-center">
                      <Camera size={64} strokeWidth={1} className="mb-4" />
                      <p className="text-[10px] uppercase font-black tracking-widest">Image Preview</p>
                      <p className="text-[9px] mt-2 italic">A beautiful city photo will be chosen for you if left blank</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="card p-10 bg-[var(--color-surface)] border-[var(--color-border)] shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[var(--color-accent-soft)] text-[var(--color-accent)] rounded-2xl">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-[var(--color-text)]">Visibility</h3>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-[var(--color-bg)] rounded-3xl border border-[var(--color-border)]">
                <div>
                  <h4 className="font-bold text-[var(--color-text)]">Public Trip</h4>
                  <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest mt-1">Shared Path</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isPublic}
                    onChange={() => setIsPublic(!isPublic)}
                  />
                  <div className="w-14 h-8 bg-[var(--color-surface)] border border-[var(--color-border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/20 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                </label>
              </div>

              <div className="mt-12 space-y-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-primary py-6 text-xl flex items-center justify-center gap-4 group shadow-[0_0_30px_rgba(212,168,67,0.2)] hover:shadow-[0_0_40px_rgba(212,168,67,0.4)] transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={28} />
                  ) : (
                    <>
                      <Plus className="group-hover:rotate-90 transition-transform duration-500" size={28} strokeWidth={3} />
                      <span className="font-black uppercase tracking-[0.2em] text-sm">Initiate Journey</span>
                    </>
                  )}
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  )
}
