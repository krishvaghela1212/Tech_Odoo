import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  ArrowLeft,
  Share2,
  Edit,
  MoreVertical,
  Plus,
  Loader2,
  LayoutList,
  CalendarDays
} from 'lucide-react'

export default function ItineraryViewPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'calendar'

  useEffect(() => {
    fetchTripData()
  }, [tripId])

  const fetchTripData = async () => {
    setLoading(true)
    // STATIC MODE: Full mock data with premium styling and images
    setTimeout(() => {
      setTrip({
        id: tripId,
        name: 'Grand European Tour',
        start_date: '2025-06-15',
        end_date: '2025-06-30',
        total_budget: 4500,
        description: 'A historical journey through the heart of Europe, exploring iconic landmarks and hidden gems.',
        cover_photo_url: 'https://images.unsplash.com/photo-1471623322304-7e37996b0603?w=1600&q=80'
      })

      setStops([
        { 
          id: 's1', 
          city_name: 'Paris', 
          country: 'France', 
          start_date: '2025-06-15', 
          end_date: '2025-06-20',
          image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=60',
          activities: [
            { id: 'a1', name: 'Eiffel Tower Sunset Visit', cost: 45, category: 'Sightseeing', scheduled_time: '18:30' },
            { id: 'a2', name: 'Louvre Museum Tour', cost: 30, category: 'Culture', scheduled_time: '10:00' },
            { id: 'a3', name: 'Seine River Dinner Cruise', cost: 120, category: 'Dining', scheduled_time: '20:00' }
          ]
        },
        { 
          id: 's2', 
          city_name: 'Rome', 
          country: 'Italy', 
          start_date: '2025-06-21', 
          end_date: '2025-06-26',
          image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=60',
          activities: [
            { id: 'a4', name: 'Colosseum & Roman Forum', cost: 55, category: 'History', scheduled_time: '09:00' },
            { id: 'a5', name: 'Vatican Museums', cost: 40, category: 'Culture', scheduled_time: '14:00' },
            { id: 'a6', name: 'Trastevere Food Tour', cost: 75, category: 'Dining', scheduled_time: '19:00' }
          ]
        },
        { 
          id: 's3', 
          city_name: 'Venice', 
          country: 'Italy', 
          start_date: '2025-06-27', 
          end_date: '2025-06-30',
          image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&q=60',
          activities: [
            { id: 'a7', name: 'Grand Canal Gondola Ride', cost: 80, category: 'Adventure', scheduled_time: '17:00' },
            { id: 'a8', name: 'St. Marks Basilica Visit', cost: 20, category: 'Culture', scheduled_time: '11:00' }
          ]
        }
      ])
      setLoading(false)
    }, 500)
  }

  const totalCost = stops.reduce((acc, stop) => {
    return acc + (stop.activities?.reduce((sum, act) => sum + (act.cost || 0), 0) || 0)
  }, 0)

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] bg-[var(--color-bg)]">
      <Loader2 className="animate-spin text-[var(--color-primary)] mb-4" size={48} />
      <p className="text-[var(--color-text-muted)] animate-pulse uppercase tracking-[0.2em] text-[10px] font-bold">Unfolding your journey...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-32 relative overflow-x-hidden">
      {/* Unified Immersive Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/80 z-10"></div>
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80" 
          className="w-full h-full object-cover grayscale opacity-40" 
          alt="Unified Travel Background" 
        />
      </div>

      {/* Hero Section - Now Transparent to show unified background */}
      <div className="relative h-[320px] md:h-[400px] flex items-start overflow-hidden">
        <div className="container mx-auto px-6 relative z-30 pt-24 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <button onClick={() => navigate('/trips')} className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.2em] md:tracking-[0.3em] mb-3 md:mb-4 hover:opacity-70 transition-all group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Explorations
            </button>
            <h1 className="font-display text-3xl sm:text-5xl md:text-8xl font-black text-[var(--color-secondary)] mb-4 italic tracking-tighter leading-tight drop-shadow-sm">
              {trip?.name}
            </h1>
            <div className="flex flex-wrap gap-4 md:gap-8 items-center text-[var(--color-text)]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)]">
                  <Calendar size={16} className="text-[var(--color-primary)]" />
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Timeline</div>
                  <div className="text-xs md:text-sm font-bold">{new Date(trip?.start_date).toLocaleDateString()} — {new Date(trip?.end_date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)]">
                  <MapPin size={16} className="text-[var(--color-accent)]" />
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Destinations</div>
                  <div className="text-xs md:text-sm font-bold">{stops.length} Cities Exploration</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* View Toggle - Responsive Position */}
        <div className="absolute top-20 md:top-10 right-6 z-30 flex bg-black/40 backdrop-blur-2xl p-1 rounded-xl md:rounded-2xl border border-white/10 shadow-2xl scale-75 md:scale-100">
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-[var(--color-primary)] text-[var(--color-bg)]' : 'text-white/60 hover:text-white'}`}
          >
            <LayoutList size={14} md:size={16} /> List
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-[var(--color-primary)] text-[var(--color-bg)]' : 'text-white/60 hover:text-white'}`}
          >
            <CalendarDays size={14} md:size={16} /> Calendar
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-10 md:-mt-20 relative z-40">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Main Itinerary */}
          <div className="lg:col-span-3 space-y-12 md:space-y-16">
            {stops.map((stop, index) => (
              <motion.div 
                key={stop.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] text-[var(--color-bg)] flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(212,168,67,0.4)]">
                      {index + 1}
                    </div>
                    {index !== stops.length - 1 && <div className="w-0.5 h-12 bg-gradient-to-b from-[var(--color-primary)] to-transparent mt-4 opacity-30"></div>}
                  </div>
                  <div>
                    <h2 className="font-display text-4xl font-bold text-[var(--color-secondary)] leading-none mb-2">
                      {stop.city_name}, <span className="text-[var(--color-primary)] opacity-60 font-medium text-2xl">{stop.country}</span>
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
                      {new Date(stop.start_date).toDateString()} — {new Date(stop.end_date).toDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[350px] group-hover:scale-[1.02] transition-transform duration-500">
                    <img src={stop.image} className="w-full h-full object-cover" alt={stop.city_name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                      <div className="text-white">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">Base Station</div>
                        <div className="font-bold">{stop.city_name}</div>
                      </div>
                      <Link to={`/trips/${tripId}/builder`} className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-[var(--color-primary)] transition-all">
                        <Plus size={20} />
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {stop.activities?.map((activity) => (
                      <motion.div 
                        key={activity.id}
                        whileHover={{ x: 10 }}
                        className="card p-5 bg-[var(--color-surface)]/50 backdrop-blur-sm border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all cursor-pointer flex justify-between items-center group/item"
                      >
                        <div className="flex items-center gap-5">
                          <div className="p-3 bg-[var(--color-bg)] rounded-xl text-[var(--color-primary)] group-hover/item:scale-110 transition-transform">
                            <Clock size={18} />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)]">{activity.scheduled_time} • {activity.category}</div>
                            <div className="font-bold text-[var(--color-secondary)]">{activity.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[var(--color-accent)]">${activity.cost}</div>
                          <ChevronRight size={16} className="ml-auto text-[var(--color-border)] group-hover/item:text-[var(--color-primary)]" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar Stats - Made Sticky */}
          <div className="lg:block">
            <div className="sticky top-32 space-y-8">
              <div className="card bg-[var(--color-surface)] p-8 border border-[var(--color-border)] shadow-2xl">
                <h3 className="font-display text-xl font-bold mb-8">Trip Statistics</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-6 border-b border-[var(--color-border)]">
                    <div className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Total Days</div>
                    <div className="text-2xl font-display font-bold text-[var(--color-secondary)]">16</div>
                  </div>
                  <div className="flex justify-between items-center pb-6 border-b border-[var(--color-border)]">
                    <div className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Est. Total Cost</div>
                    <div className="text-2xl font-display font-bold text-[var(--color-primary)]">${totalCost.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Budget Remaining</div>
                    <div className="text-2xl font-display font-bold text-[var(--color-accent)]">${(trip?.total_budget - totalCost).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="btn-primary w-full py-4 flex items-center justify-center gap-3 shadow-xl">
                  <Share2 size={18} /> Share Itinerary
                </button>
                <Link to={`/trips/${tripId}/builder`} className="w-full py-4 flex items-center justify-center gap-3 font-bold text-[var(--color-text)] border border-[var(--color-border)] rounded-2xl hover:bg-[var(--color-surface)] transition-all bg-[var(--color-surface)]/40">
                  <Edit size={18} /> Edit Journey
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
