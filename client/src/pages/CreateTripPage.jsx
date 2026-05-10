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
          start_date: startDate ? startDate.toISOString() : null, 
          end_date: endDate ? endDate.toISOString() : null, 
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
    <div className="min-h-screen bg-[var(--color-bg)] pb-24">
      {/* Dynamic Header */}
      <div className="relative h-64 bg-[var(--color-secondary)] overflow-hidden">
        {coverUrl && !imgError ? (
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            src={coverUrl} 
            alt="Preview" 
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] opacity-40"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] to-transparent"></div>
        
        <div className="absolute inset-0 flex items-center justify-center pt-12">
          <div className="container mx-auto px-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors font-medium"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white italic drop-shadow-lg">
              {name || 'New Adventure'}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-12 relative z-10">
        <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Left - Form Fields */}
          <div className="lg:col-span-2 space-y-8">
            <section className="card shadow-2xl border-none">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded-xl">
                  <Info size={20} />
                </div>
                <h3 className="font-display text-2xl font-bold text-[var(--color-secondary)]">Trip Details</h3>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2 ml-1">Trip Name</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                    <input 
                      type="text" 
                      required 
                      className="input-field pl-12 py-4" 
                      placeholder="e.g. Kyoto Cherry Blossom Tour"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2 ml-1">Short Description</label>
                  <textarea 
                    rows={4}
                    className="input-field py-4" 
                    placeholder="What are you hoping to experience on this journey?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="card shadow-2xl border-none">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[var(--color-accent-soft)] text-[var(--color-accent)] rounded-xl">
                  <Calendar size={20} />
                </div>
                <h3 className="font-display text-2xl font-bold text-[var(--color-secondary)]">Timing & Budget</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2 ml-1">Start Date</label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        placeholderText="Select start"
                        className="input-field w-full"
                        dateFormat="MMM d, yyyy"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2 ml-1">End Date</label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        placeholderText="Select end"
                        className="input-field w-full"
                        minDate={startDate || undefined}
                        dateFormat="MMM d, yyyy"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2 ml-1">Total Budget ($)</label>
                    <div className="relative group">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                      <input 
                        type="number" 
                        className="input-field pl-12 py-4" 
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
          <div className="space-y-8">
            <section className="card shadow-2xl border-none bg-[var(--color-surface)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[var(--color-accent-soft)] text-[var(--color-accent)] rounded-xl">
                  <Camera size={20} />
                </div>
                <h3 className="font-display text-2xl font-bold text-[var(--color-text)]">Visual Context</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2 ml-1">Cover Photo URL</label>
                  <div className="relative group">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                    <input 
                      type="url" 
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl pl-12 py-4 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)] transition-all" 
                      placeholder="Paste Unsplash URL here..."
                      value={coverUrl}
                      onChange={(e) => {
                        setCoverUrl(e.target.value);
                        setImgError(false);
                      }}
                    />
                  </div>
                </div>

                <div className="aspect-video w-full rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] overflow-hidden relative">
                  {coverUrl && !imgError ? (
                    <img 
                      src={coverUrl} 
                      className="w-full h-full object-cover" 
                      alt="Preview" 
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 p-6 text-center">
                      {imgError ? (
                        <>
                          <Info size={48} className="mb-2 text-[var(--color-danger)] opacity-50" />
                          <p className="text-xs uppercase font-bold tracking-widest text-[var(--color-danger)] opacity-50">Invalid Image URL</p>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={48} className="mb-2" />
                          <p className="text-xs uppercase font-bold tracking-widest">Image Preview</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="card shadow-2xl border-none">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded-xl">
                  <Globe size={20} />
                </div>
                <h3 className="font-display text-2xl font-bold text-[var(--color-secondary)]">Visibility</h3>
              </div>

              <div className="flex items-center justify-between p-6 bg-[var(--color-bg)] rounded-3xl border border-[var(--color-border)]">
                <div className="flex items-start gap-3">
                  <div>
                    <h4 className="font-bold text-[var(--color-secondary)] mb-1">Public Trip</h4>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">Allow others to view and be inspired by your path.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isPublic}
                    onChange={() => setIsPublic(!isPublic)}
                  />
                  <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                </label>
              </div>

              <div className="mt-12 space-y-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <Plus className="group-hover:rotate-90 transition-transform duration-300" size={24} />
                      Create Trip
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
                  <Eye size={12} /> Live planning begins next
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  )
}
