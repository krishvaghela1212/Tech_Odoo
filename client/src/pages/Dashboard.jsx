import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { motion } from 'motion/react'
import { Plus, Compass, ArrowRight, Loader2, Map as MapIcon, Globe } from 'lucide-react'
import TripCard from '../components/TripCard'

export default function Dashboard() {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentTrips()
  }, [])

  const fetchRecentTrips = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*, stops(id)') // Using count logic in component
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (error) throw error
      setTrips(data || [])
    } catch (err) {
      console.error('Error fetching trips:', err)
    } finally {
      setLoading(false)
    }
  }

  const suggestions = [
    { name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=60' },
    { name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=60' },
    { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60' },
    { name: 'New York', country: 'USA', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=60' },
    { name: 'Rome', country: 'Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=60' },
    { name: 'Istanbul', country: 'Turkey', img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop&q=60' }
  ]

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-3xl p-8 md:p-12 text-[var(--color-bg)] overflow-hidden shadow-2xl mb-12"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 italic">
              Good morning, {user?.user_metadata?.full_name?.split(' ')[0] || 'Traveler'}
            </h1>
            <p className="text-[var(--color-bg)]/80 text-lg md:text-xl font-light max-w-md">
              Where are we going next? Your next adventure is just a few clicks away.
            </p>
          </div>
          <Link 
            to="/create-trip" 
            className="bg-[var(--color-bg)] text-[var(--color-primary)] px-8 py-4 rounded-xl font-body font-bold flex items-center gap-2 hover:bg-[var(--color-surface)] transition-all shadow-lg active:scale-95 border border-[var(--color-primary)]/20"
          >
            <Plus size={20} />
            Plan New Trip
          </Link>
        </div>
        <Globe className="absolute -bottom-10 -right-10 text-[var(--color-bg)]/10 w-64 h-64" />
      </motion.div>

      {/* Recent Trips Section */}
      <section className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-[var(--color-secondary)]">Your Recent Trips</h2>
            <div className="h-1 w-12 bg-[var(--color-accent)] mt-2 rounded-full"></div>
          </div>
          <Link to="/trips" className="text-[var(--color-primary)] font-bold flex items-center gap-1 hover:underline">
            See All <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
          </div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-20 flex flex-col items-center border-dashed border-2 bg-transparent">
            <div className="w-20 h-20 bg-[var(--color-bg)] rounded-full flex items-center justify-center text-[var(--color-text-muted)] mb-4">
              <MapIcon size={40} />
            </div>
            <h3 className="font-display text-2xl font-bold text-[var(--color-secondary)] mb-2">No trips planned yet</h3>
            <p className="text-[var(--color-text-muted)] mb-8 max-w-sm">
              Your map looks a bit empty. Let's add some color to it by planning your first journey!
            </p>
            <Link to="/trips/new" className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Add Your First City
            </Link>
          </div>
        )}
      </section>

      {/* Suggested Destinations */}
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-[var(--color-secondary)]">Explore Popular Cities</h2>
          <div className="h-1 w-12 bg-[var(--color-accent)] mt-2 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {suggestions.map((city, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all"
            >
              <img 
                src={city.img} 
                alt={city.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <span className="badge bg-[var(--color-accent)] text-[var(--color-text)] mb-1 scale-75 origin-left">
                  {city.country}
                </span>
                <h4 className="font-display text-xl font-bold">{city.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Budget Snapshot - Optional/Bonus */}
      {trips.length > 0 && (
        <section className="card bg-[var(--color-surface)] text-[var(--color-text)] border-none shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Compass size={120} className="text-[var(--color-accent)]" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-display text-3xl font-bold mb-2 italic">Architecture Snapshot</h3>
              <p className="text-[var(--color-text-muted)] italic">Tracking your milestones across the midnight atlas.</p>
            </div>
            <div className="flex gap-12 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-display font-bold text-[var(--color-primary)]">{trips.length}</div>
                <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-2">Voyages</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-display font-bold text-[var(--color-accent)]">
                  {trips.reduce((acc, trip) => acc + (trip.stops?.length || 0), 0)}
                </div>
                <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-2">Anchors</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-display font-bold text-[var(--color-primary)]">
                  ${trips.reduce((acc, trip) => acc + (trip.total_budget || 0), 0).toLocaleString()}
                </div>
                <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.2em] mt-2">Balance</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
