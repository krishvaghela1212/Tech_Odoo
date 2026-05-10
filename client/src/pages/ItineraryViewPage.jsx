import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Calendar as CalendarIcon, 
  List, 
  MapPin, 
  ArrowLeft, 
  Edit3, 
  Share2, 
  Loader2,
  DollarSign
} from 'lucide-react'

export default function ItineraryViewPage() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('list')

  useEffect(() => {
    fetchTripData()
  }, [tripId])

  const fetchTripData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('trips')
        .select(`*, stops(*, activities(*))`)
        .eq('id', tripId)
        .single()
      
      if (error) throw error
      setTrip(data)
      setStops((data.stops || []).sort((a, b) => a.order_index - b.order_index))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const totalCost = stops.reduce((acc, stop) => {
    const stopActivitiesCost = (stop.activities || []).reduce((sum, act) => sum + (parseFloat(act.estimated_cost) || 0), 0)
    return acc + stopActivitiesCost
  }, 0)

  const handleShare = () => {
    const url = `${window.location.origin}/share/${trip.share_token}`
    navigator.clipboard.writeText(url)
    alert('Public link copied to clipboard!')
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)]">
      <Loader2 className="animate-spin text-[var(--color-primary)] mb-4" size={48} />
      <p className="text-[var(--color-text-muted)] animate-pulse font-display text-xl">Drawing your map...</p>
    </div>
  )

  return (
    <div className="pb-24 bg-[var(--color-bg)] min-h-screen">
      {/* Header Banner */}
      <div className="relative h-96 bg-[var(--color-secondary)] overflow-hidden">
        {trip?.cover_photo_url ? (
          <img 
            src={trip.cover_photo_url} 
            alt={trip.name} 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] opacity-40"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent"></div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-12">
            <Link to="/trips" className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mb-6 hover:gap-3 transition-all">
              <ArrowLeft size={14} /> Back to Trips
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-2xl">
                <h1 className="font-display text-6xl md:text-7xl font-bold text-[var(--color-secondary)] leading-none italic">{trip?.name}</h1>
                <div className="flex items-center gap-6 mt-6">
                  <div className="flex items-center gap-2 text-lg text-[var(--color-text-muted)] font-medium">
                    <CalendarIcon className="text-[var(--color-primary)]" size={20} />
                    {trip?.start_date ? new Date(trip.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'TBD'}
                  </div>
                  <div className="w-px h-6 bg-[var(--color-border)]"></div>
                  <div className="flex items-center gap-2 text-lg text-[var(--color-text-muted)] font-medium">
                    <MapPin className="text-[var(--color-accent)]" size={20} />
                    {stops.length} Cities
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex bg-white/80 backdrop-blur rounded-xl p-1 border border-white/50 shadow-sm">
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-[var(--color-secondary)] text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-secondary)]'}`}
                  >
                    <List size={18} /> List
                  </button>
                  <button 
                    onClick={() => setViewMode('calendar')}
                    className={`p-3 rounded-lg flex items-center gap-2 text-sm font-bold transition-all ${viewMode === 'calendar' ? 'bg-[var(--color-secondary)] text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-secondary)]'}`}
                  >
                    <CalendarIcon size={18} /> Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              {stops.map((stop, i) => (
                <div key={stop.id} className="relative">
                  {/* Decorative Line Connection */}
                  {i < stops.length - 1 && (
                    <div className="absolute left-6 top-32 bottom-[-4rem] w-1 border-l-2 border-dashed border-[var(--color-border)]"></div>
                  )}

                  <div className="flex flex-col md:flex-row gap-12">
                    <div className="md:w-1/3">
                      <div className="sticky top-24">
                        <div className={`p-10 rounded-3xl overflow-hidden relative shadow-2xl border-l-[12px] border-[var(--color-primary)] bg-white`}>
                          <div className="absolute top-0 right-0 p-8 opacity-5">
                            <MapPin size={120} />
                          </div>
                          <div className="relative z-10">
                            <span className="badge-teal badge mb-3 uppercase tracking-widest text-[10px] font-bold">{stop.country}</span>
                            <h3 className="font-display text-4xl font-bold text-[var(--color-secondary)] mb-4">{stop.city_name}</h3>
                            <div className="space-y-4 text-[var(--color-text-muted)] font-medium">
                              <div className="flex items-center gap-3">
                                <CalendarIcon size={18} className="text-[var(--color-accent)]" />
                                <span>{stop.start_date ? new Date(stop.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'} — {stop.end_date ? new Date(stop.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <DollarSign size={18} className="text-[var(--color-success)]" />
                                <span>Budget: {'$'.repeat(stop.cost_index)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-2/3 space-y-6">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] border-b border-[var(--color-border)] pb-2 mb-8">Daily Activities</h4>
                      {stop.activities && stop.activities.length > 0 ? (
                        <div className="space-y-6">
                          {stop.activities.map((activity) => (
                            <div key={activity.id} className="card bg-white p-6 flex items-center justify-between border-none shadow-md hover:shadow-xl transition-all group">
                              <div className="flex items-center gap-6">
                                <div className="text-center min-w-[70px]">
                                  <div className="text-2xl font-display font-bold text-[var(--color-secondary)] leading-none">{activity.scheduled_time?.substring(0, 5)}</div>
                                  <div className="text-[10px] font-bold uppercase text-[var(--color-text-muted)] mt-1">Start</div>
                                </div>
                                <div className="h-10 w-px bg-[var(--color-border)]"></div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-body font-bold text-lg group-hover:text-[var(--color-primary)] transition-colors">{activity.name}</h5>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-bg)] font-bold uppercase text-[var(--color-text-muted)]">{activity.activity_type}</span>
                                  </div>
                                  <p className="text-sm text-[var(--color-text-muted)] line-clamp-1">{activity.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 font-bold text-[var(--color-success)]">
                                ${parseFloat(activity.estimated_cost).toFixed(0)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-12 text-center bg-white/40 rounded-3xl border-2 border-dashed border-[var(--color-border)]">
                          <p className="text-[var(--color-text-muted)] italic">No activities planned for this city stop yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="calendar"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl p-8 shadow-2xl border border-[var(--color-border)]"
            >
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-[var(--color-bg)] rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--color-text-muted)]">
                  <CalendarIcon size={40} />
                </div>
                <h3 className="font-display text-3xl font-bold text-[var(--color-secondary)] mb-2">Calendar View Coming Soon</h3>
                <p className="text-[var(--color-text-muted)] max-w-sm mx-auto">
                  We're working on a beautiful grid view to help you visualize your trip timing more efficiently.
                </p>
                <button onClick={() => setViewMode('list')} className="btn-outline mt-8 px-10">Return to List View</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-secondary)] text-white p-4 z-[90] shadow-[0_-10px_30px_rgba(42,72,88,0.2)]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Total Duration</span>
              <span className="font-display text-xl font-bold text-[var(--color-accent)]">{stops.length} Cities</span>
            </div>
            <div className="h-8 w-px bg-white/20 hidden md:block"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Est. Total Cost</span>
              <span className="font-display text-xl font-bold text-[var(--color-accent)]">${totalCost.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <Link to={`/trips/${tripId}/builder`} className="flex-1 md:flex-none text-center px-8 py-3 rounded-xl border border-white/20 font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Edit3 size={18} /> Edit Trip
            </Link>
            <button 
              onClick={handleShare}
              className="flex-1 md:flex-none text-center px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-dark)] transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Share2 size={18} /> Share Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
