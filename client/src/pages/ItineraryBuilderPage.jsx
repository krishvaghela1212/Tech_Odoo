import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { motion, Reorder, AnimatePresence } from 'motion/react'
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Clock, 
  Trash2, 
  GripVertical, 
  ChevronRight, 
  ArrowLeft,
  Loader2,
  Wallet,
  Activity as ActivityIcon
} from 'lucide-react'

export default function ItineraryBuilderPage() {
  const { tripId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [trip, setTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [selectedStopId, setSelectedStopId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (tripId) fetchTripData()
  }, [tripId])

  const fetchTripData = async () => {
    setLoading(true)
    try {
      const { data: tripData, error } = await supabase
        .from('trips')
        .select(`*, stops(*)`)
        .eq('id', tripId)
        .single()
      
      if (error) throw error
      setTrip(tripData)
      
      const sortedStops = (tripData.stops || []).sort((a, b) => a.order_index - b.order_index)
      setStops(sortedStops)
      
      if (sortedStops.length > 0 && !selectedStopId) {
        setSelectedStopId(sortedStops[0].id)
      }
    } catch (err) {
      console.error('Error fetching trip data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReorder = async (newStops) => {
    setStops(newStops)
    // Update order_index in Supabase
    try {
      const updates = newStops.map((stop, index) => ({
        id: stop.id,
        order_index: index
      }))
      
      for (const update of updates) {
        await supabase.from('stops').update({ order_index: update.order_index }).eq('id', update.id)
      }
    } catch (err) {
      console.error('Error updating order:', err)
    }
  }

  const deleteStop = async (stopId) => {
    if (!window.confirm('Delete this city stop and all its activities?')) return
    
    try {
      await supabase.from('stops').delete().eq('id', stopId)
      const updatedStops = stops.filter(s => s.id !== stopId)
      setStops(updatedStops)
      if (selectedStopId === stopId) {
        setSelectedStopId(updatedStops[0]?.id || null)
      }
    } catch (err) {
      console.error('Error deleting stop:', err)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] gap-4">
      <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} />
      <p className="text-[var(--color-text-muted)] font-display text-xl animate-pulse">Building your route...</p>
    </div>
  )

  const activeStop = stops.find(s => s.id === selectedStopId)

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-72px)] bg-[var(--color-bg)]">
      {/* Sidebar - Stops List */}
      <aside className="w-full md:w-[350px] bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col shadow-lg z-10">
        <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]/30">
          <Link to="/trips" className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4 hover:gap-3 transition-all">
            <ArrowLeft size={14} /> Back to My Trips
          </Link>
          <h1 className="font-display text-3xl font-bold text-[var(--color-secondary)] leading-tight">{trip?.name}</h1>
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mt-2">
            <Calendar size={14} />
            <span>{trip?.start_date ? new Date(trip.start_date).toLocaleDateString() : 'TBD'}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Your Stops</h2>
            <Link 
              to={`/trips/${tripId}/cities`}
              className="p-1 px-2 text-[10px] font-bold bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded hover:bg-[var(--color-primary)] hover:text-white transition-all uppercase"
            >
              + Add City
            </Link>
          </div>

          <Reorder.Group axis="y" values={stops} onReorder={handleReorder} className="space-y-3">
            <AnimatePresence>
              {stops.map((stop) => (
                <Reorder.Item 
                  key={stop.id} 
                  value={stop}
                  className={`relative cursor-pointer group rounded-xl border transition-all ${
                    selectedStopId === stop.id 
                      ? 'bg-[var(--color-surface-alt)] border-[var(--color-primary)] shadow-md ring-1 ring-[var(--color-primary)]' 
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary-soft)]'
                  }`}
                  onClick={() => setSelectedStopId(stop.id)}
                >
                  <div className="p-4 pr-12">
                    <div className="flex items-center gap-3">
                      <GripVertical className="text-gray-300 group-hover:text-[var(--color-primary-soft)] transition-colors" size={16} />
                      <div>
                        <h4 className="font-display font-bold text-[var(--color-secondary)]">{stop.city_name}</h4>
                        <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-medium">
                          {stop.start_date ? `${new Date(stop.start_date).toLocaleDateString()} - ${new Date(stop.end_date).toLocaleDateString()}` : 'Dates TBD'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteStop(stop.id); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-[var(--color-danger)] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>

                  {selectedStopId === stop.id && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-[var(--color-primary)] rounded-r-full"></div>
                  )}
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {stops.length === 0 && (
            <div className="text-center py-10 px-6">
              <div className="w-12 h-12 bg-[var(--color-bg)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-text-muted)]">
                <MapPin size={24} />
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mb-4 italic">No cities added yet. Start by exploring cities!</p>
              <Link to={`/trips/${tripId}/cities`} className="btn-outline text-xs py-2 w-full">Explore Cities</Link>
            </div>
          )}
        </div>

        <div className="p-6 bg-[var(--color-surface-alt)] border-t border-[var(--color-border)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Trip Actions</span>
            <Link to={`/trips/${tripId}/view`} className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1">
              Final View <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link to={`/trips/${tripId}/budget`} className="flex flex-col items-center gap-2 p-3 bg-[var(--color-bg)] rounded-xl hover:bg-[var(--color-primary-soft)] transition-all text-xs font-bold border border-[var(--color-border)] text-[var(--color-text)]">
              <Wallet size={18} className="text-[var(--color-primary)]" /> Budget
            </Link>
            <Link to={`/trips/${tripId}/checklist`} className="flex flex-col items-center gap-2 p-3 bg-[var(--color-bg)] rounded-xl hover:bg-[var(--color-primary-soft)] transition-all text-xs font-bold border border-[var(--color-border)] text-[var(--color-text)]">
              <Plus size={18} className="text-[var(--color-primary)]" /> Packing
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Panel - Stop Details & Activities */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        <AnimatePresence mode="wait">
          {activeStop ? (
            <motion.div 
              key={activeStop.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="badge-teal badge uppercase tracking-widest text-[10px]">{activeStop.country}</span>
                    <span className="badge-accent badge flex items-center gap-1">
                      {'$'.repeat(activeStop.cost_index || 1)} Cost Index
                    </span>
                  </div>
                  <h2 className="font-display text-5xl md:text-6xl font-bold text-[var(--color-secondary)]">{activeStop.city_name}</h2>
                  <div className="flex items-center gap-3 text-lg text-[var(--color-text-muted)] mt-2">
                    <Calendar size={20} className="text-[var(--color-accent)]" />
                    <span>
                      {activeStop.start_date ? new Date(activeStop.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'TBD'}
                      {activeStop.end_date ? ` — ${new Date(activeStop.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}` : ''}
                    </span>
                  </div>
                </div>
                <Link 
                  to={`/trips/${tripId}/stops/${activeStop.id}/activities`}
                  className="btn-primary flex items-center justify-center gap-2 shadow-xl hover:scale-105"
                >
                  <Plus size={20} /> Add Activity
                </Link>
              </div>

              <ActivitiesList stopId={activeStop.id} tripId={tripId} />
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-32 h-32 bg-[var(--color-surface)] rounded-full flex items-center justify-center shadow-inner mb-8">
                <MapPin size={64} className="text-[var(--color-border)]" />
              </div>
              <h2 className="font-display text-3xl font-bold text-[var(--color-secondary)] mb-4">No City Selected</h2>
              <p className="text-[var(--color-text-muted)] max-w-md mb-8">
                Select a city from the sidebar to plan its activities, or add a new stop to your journey.
              </p>
              {stops.length === 0 && (
                <Link to={`/trips/${tripId}/cities`} className="btn-primary px-12">
                   Add Your First Stop
                </Link>
              )}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function ActivitiesList({ stopId, tripId }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [stopId])

  const fetchActivities = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('stop_id', stopId)
      .order('scheduled_time', { ascending: true })
    
    if (!error) setActivities(data || [])
    setLoading(false)
  }

  const deleteActivity = async (id) => {
    try {
      const { error } = await supabase.from('activities').delete().eq('id', id)
      if (error) throw error
      setActivities(activities.filter(a => a.id !== id))
    } catch (err) {
      console.error('Error deleting activity:', err)
    }
  }

  const getTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'sightseeing': return 'bg-teal-50 text-teal-700 border-teal-100'
      case 'food': return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'adventure': return 'bg-orange-50 text-orange-700 border-orange-100'
      case 'transport': return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'stay': return 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary-soft)]'
      default: return 'bg-gray-50 text-gray-700 border-gray-100'
    }
  }

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-[var(--color-surface)]/50 rounded-2xl animate-pulse ring-1 ring-[var(--color-border)]"></div>)}</div>

  return (
    <div className="space-y-6">
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={activity.id}
              className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-primary)]">
                  <ActivityIcon size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${getTypeColor(activity.category)}`}>
                      {activity.category}
                    </span>
                    <h4 className="font-body font-bold text-[var(--color-text)] underline-offset-4 group-hover:underline">{activity.name}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)] font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-[var(--color-accent)]" />
                      {activity.scheduled_date ? new Date(activity.scheduled_date).toLocaleDateString() : 'TBD'}
                    </div>
                    {activity.scheduled_time && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-[var(--color-accent)]" />
                        {activity.scheduled_time.substring(0, 5)}
                      </div>
                    )}
                    {activity.estimated_cost > 0 && (
                      <div className="font-bold text-[var(--color-success)]">
                        ${parseFloat(activity.estimated_cost).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => deleteActivity(activity.id)}
                  className="p-2 text-gray-300 hover:text-[var(--color-danger)] transition-all bg-[var(--color-bg)] rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[var(--color-surface)]/50 rounded-3xl border-2 border-dashed border-[var(--color-border)] ring-1 ring-white/5">
          <div className="w-16 h-16 bg-[var(--color-surface)] rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300 shadow-sm">
            <Plus size={32} />
          </div>
          <h4 className="font-display text-xl font-bold text-[var(--color-secondary)] mb-2">No activities planned</h4>
          <p className="text-[var(--color-text-muted)] mb-8">What would you like to do in this city?</p>
          <Link to={`/trips/${tripId}/stops/${stopId}/activities`} className="btn-outline px-10">Add Activity</Link>
        </div>
      )}
    </div>
  )
}
