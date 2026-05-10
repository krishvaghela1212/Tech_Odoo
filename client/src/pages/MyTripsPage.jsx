import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Search, Filter, Trash2, AlertCircle, Loader2 } from 'lucide-react'
import TripCard from '../components/TripCard'
import CinematicBackground from '../components/CinematicBackground'

export default function MyTripsPage() {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchTrips()

    if (!user?.id) return;

    const channel = supabase
      .channel('trips-channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'trips',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTrips(prev => [...prev, payload.new])
        }
        if (payload.eventType === 'DELETE') {
          setTrips(prev => prev.filter(i => i.id !== payload.old.id))
        }
        if (payload.eventType === 'UPDATE') {
          setTrips(prev => prev.map(i => i.id === payload.new.id ? payload.new : i))
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user?.id])

  const fetchTrips = async () => {
  setLoading(true)
  try {
    const { data, error } = await supabase
      .from('trips')
      .select(`*, stops(count)`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    setTrips(data || [])
  } catch (err) {
    console.error('Error fetching trips:', err)
  } finally {
    setLoading(false)
  }
}

  const deleteTrip = async (tripId) => {
    try {
      const { error } = await supabase.from('trips').delete().eq('id', tripId)
      if (error) throw error
      setTrips(trips.filter(t => t.id !== tripId))
      setDeletingId(null)
    } catch (err) {
      console.error('Error deleting trip:', err)
    }
  }

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchTerm.toLowerCase())
    const now = new Date()
    const startDate = trip.start_date ? new Date(trip.start_date) : null
    
    if (filter === 'upcoming') return matchesSearch && (startDate ? startDate >= now : true)
    if (filter === 'past') return matchesSearch && (startDate ? startDate < now : false)
    return matchesSearch
  })

  return (
    <div className="relative min-h-screen">
      <CinematicBackground />

      <div className="container mx-auto px-6 py-10 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="font-display text-4xl font-bold text-[var(--color-secondary)]">My Trips</h1>
          <div className="h-1.5 w-16 bg-[var(--color-accent)] mt-2 rounded-full"></div>
        </div>
        <Link to="/trips/new" className="btn-primary flex items-center gap-2 self-start md:self-auto">
          <Plus size={20} /> New Trip
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-[var(--color-surface)]/80 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-[var(--color-border)] mb-10 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search your adventures..." 
            className="input-field pl-12 bg-[var(--color-bg)]/50 border-none focus:ring-2 ring-[var(--color-primary-soft)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex bg-[var(--color-bg)] p-1 rounded-xl w-full lg:w-auto">
          {['all', 'upcoming', 'past'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 lg:flex-none lg:px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                filter === f 
                  ? 'bg-[var(--color-bg)] text-[var(--color-primary)] shadow-inner border border-[var(--color-border)]' 
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} />
          <span className="font-medium text-[var(--color-text-muted)] animate-pulse">Consulting the maps...</span>
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="relative group/card">
              <TripCard trip={trip} />
              
              <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                <button 
                  onClick={() => setDeletingId(trip.id)}
                  className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white transition-all"
                  title="Delete Trip"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-24 flex flex-col items-center bg-[var(--color-surface-alt)]/30 border-dashed border-2">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[var(--color-text-muted)] mb-6 shadow-sm">
            <Filter size={40} className="opacity-20" />
          </div>
          <h3 className="font-display text-3xl font-bold text-[var(--color-secondary)] mb-3">No trips found</h3>
          <p className="text-[var(--color-text-muted)] mb-8 max-w-md">
            We couldn't find any journeys matching your current filters. 
            Try adjusting your search or start a fresh adventure!
          </p>
          <button 
            onClick={() => { setSearchTerm(''); setFilter('all'); }}
            className="btn-outline px-8"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-[var(--color-border)] text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--color-secondary)] mb-2">Delete Trip?</h2>
              <p className="text-[var(--color-text-muted)] mb-8 leading-relaxed">
                This will permanently delete this trip and all its cities, activities, and notes. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-6 py-3 rounded-xl border border-[var(--color-border)] font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] transition-all"
                >
                  Keep It
                </button>
                <button 
                  onClick={() => deleteTrip(deletingId)}
                  className="flex-1 px-6 py-3 rounded-xl bg-[var(--color-danger)] text-white font-bold hover:bg-red-700 transition-all shadow-lg"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}
