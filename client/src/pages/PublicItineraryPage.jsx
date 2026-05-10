import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion } from 'motion/react'
import { 
  Calendar, 
  Loader2, 
  Share2, 
  Heart, 
  ExternalLink,
  Map as MapIcon
} from 'lucide-react'

export default function PublicItineraryPage() {
  const { shareToken } = useParams()
  const [trip, setTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSharedTrip()
  }, [shareToken])

  const fetchSharedTrip = async () => {
    setLoading(true)
    try {
      const { data, error: tripError } = await supabase
        .from('trips')
        .select(`*, profiles(full_name, avatar_url), stops(*, activities(*))`)
        .eq('share_token', shareToken)
        .eq('is_public', true)
        .single()
      
      if (tripError) throw tripError
      setTrip(data)
      setStops((data.stops || []).sort((a, b) => a.order_index - b.order_index))
    } catch (err) {
      setError("This itinerary is private, doesn't exist, or has been removed.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg)]">
      <Loader2 className="animate-spin text-[var(--color-primary)] mb-4" size={48} />
      <p className="text-[var(--color-text-muted)] animate-pulse font-display text-2xl italic tracking-widest text-[var(--color-secondary)]">Retrieving Shared Journey...</p>
    </div>
  )

  if (error || !trip) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg)] px-6 text-center">
      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-inner mb-8">
        <MapIcon size={64} className="text-[var(--color-border)]" />
      </div>
      <h2 className="font-display text-4xl font-bold text-[var(--color-secondary)] mb-4 italic">Alas, the path is blocked!</h2>
      <p className="text-[var(--color-text-muted)] max-w-sm mb-12 text-lg">
        {error}
      </p>
      <Link to="/" className="btn-primary px-12 py-4 shadow-xl">Go to Traveloop Home</Link>
    </div>
  )

  return (
    <div className="bg-[var(--color-bg)] min-h-screen pb-32">
      {/* Hero Banner */}
      <div className="relative h-[60vh] bg-[var(--color-secondary)] overflow-hidden">
        {trip.cover_photo_url ? (
          <img 
            src={trip.cover_photo_url} 
            alt={trip.name} 
            className="w-full h-full object-cover opacity-60 scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] opacity-50"></div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/20 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-start gap-4">
              <span className="badge-accent badge py-1 text-xs uppercase tracking-widest px-4 shadow-lg">Shared Adventure</span>
              <h1 className="font-display text-6xl md:text-8xl font-bold text-[var(--color-secondary)] flex flex-wrap gap-x-4 italic leading-tight">
                {trip.name}
              </h1>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] border-2 border-white shadow-xl overflow-hidden">
                     {trip.profiles?.avatar_url ? (
                        <img src={trip.profiles.avatar_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold">{trip.profiles?.full_name?.charAt(0) || 'U'}</div>
                     )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-widest">Designed By</span>
                    <span className="font-bold text-[var(--color-secondary)]">{trip.profiles?.full_name || 'A Fellow Traveler'}</span>
                  </div>
                </div>
                <div className="w-px h-10 bg-[var(--color-border)]"></div>
                <div className="text-[var(--color-text-muted)] font-medium">
                   <div className="flex items-center gap-2 mb-1">
                      <Calendar size={16} className="text-[var(--color-accent)]" /> {stops.length} Cities
                   </div>
                   <div className="flex items-center gap-2">
                       <Heart size={16} className="text-[var(--color-danger)]" /> Beautiful Itinerary
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 mt-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left - Itinerary */}
          <div className="lg:col-span-2 space-y-20">
            {stops.map((stop, i) => (
              <div key={stop.id} className="relative">
                {i < stops.length - 1 && (
                  <div className="absolute left-6 top-32 bottom-[-5rem] w-1 border-l-2 border-dashed border-[var(--color-border)]"></div>
                )}
                
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-[280px] shrink-0">
                    <div className="card p-8 shadow-xl border-l-[8px] border-[var(--color-accent)] sticky top-24">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2 block">{stop.country}</span>
                       <h3 className="font-display text-3xl font-bold text-[var(--color-secondary)] mb-6">{stop.city_name}</h3>
                       <div className="text-sm font-medium text-[var(--color-text-muted)]">
                          {stop.start_date ? new Date(stop.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'} — {stop.end_date ? new Date(stop.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}
                       </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    {stop.activities && stop.activities.length > 0 ? stop.activities.map((act) => (
                      <div key={act.id} className="card p-6 bg-white hover:shadow-lg transition-all border-none flex items-center justify-between group">
                         <div className="flex items-center gap-6">
                            <div className="text-center min-w-[60px]">
                               <div className="font-display text-2xl font-bold text-[var(--color-secondary)]">{act.scheduled_time?.substring(0, 5)}</div>
                            </div>
                            <div className="h-8 w-px bg-[var(--color-border)]"></div>
                            <div>
                               <h5 className="font-bold text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)]">{act.name}</h5>
                               <p className="text-sm text-[var(--color-text-muted)] italic leading-relaxed">{act.description}</p>
                            </div>
                         </div>
                      </div>
                    )) : (
                      <div className="p-8 text-center bg-white/30 border-2 border-dashed border-[var(--color-border)] rounded-2xl">
                         <p className="text-sm text-[var(--color-text-muted)] italic">No daily activities shared for this stop.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Meta Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <div className="card shadow-2xl p-8 border-none bg-white">
                <h4 className="font-display text-2xl font-bold text-[var(--color-secondary)] mb-6">Inspired by this journey?</h4>
                <p className="text-[var(--color-text-muted)] mb-8 leading-relaxed">
                   Join Traveloop to copy this itinerary and customize it for your own adventure. It's free and always beautiful.
                </p>
                <Link to="/signup" className="w-full btn-primary py-4 block text-center font-bold shadow-xl">
                   Start Your Own Account
                </Link>
                <div className="mt-8 pt-8 border-t border-[var(--color-border)] flex items-center justify-center gap-6 text-[var(--color-text-muted)]">
                   <button className="hover:text-[var(--color-primary)] transition-all"><Share2 size={24} /></button>
                   <button className="hover:text-[var(--color-primary)] transition-all"><ExternalLink size={24} /></button>
                </div>
              </div>

              <div className="p-8 bg-[var(--color-primary)] rounded-3xl text-white relative overflow-hidden shadow-2xl group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                    <MapIcon size={120} />
                 </div>
                 <h4 className="font-display text-2xl font-bold mb-4 italic">Wander More.</h4>
                 <p className="text-white/70 text-sm font-light leading-relaxed">
                   Traveloop is the ultimate tool for planning complex multi-city journeys with ease, beauty, and precision.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-32 pt-20 pb-10 border-t border-[var(--color-border)]">
         <div className="container mx-auto px-6 text-center">
            <Link to="/" className="font-display text-3xl font-bold text-[var(--color-accent)] italic">Traveloop</Link>
            <p className="text-[var(--color-text-muted)] mt-2 text-sm">Create your own beautiful journeys.</p>
         </div>
      </footer>
    </div>
  )
}
