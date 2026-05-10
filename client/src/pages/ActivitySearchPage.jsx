import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Plus, 
  X, 
  Loader2, 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  Camera, 
  Utensils, 
  Map, 
  Train, 
  Home,
  Check
} from 'lucide-react'

const GENERIC_ACTIVITIES = [
  { name: 'City Center Walking Tour', type: 'sightseeing', duration: 120, cost: 20, desc: 'A guided walk through the most iconic streets and squares.' },
  { name: 'Local Food Tasting', type: 'food', duration: 90, cost: 45, desc: 'Discover the hidden culinary gems loved by locals.' },
  { name: 'Historical Museum Visit', type: 'sightseeing', duration: 180, cost: 15, desc: 'Explore the rich history and artifacts of the region.' },
  { name: 'Rooftop Cocktail Night', type: 'food', duration: 120, cost: 60, desc: 'Stunning city views paired with premium drinks.' },
  { name: 'Morning Nature Hike', type: 'adventure', duration: 150, cost: 0, desc: 'A refreshing trek to the best viewpoint in the area.' },
  { name: 'Traditional Workshop', type: 'adventure', duration: 120, cost: 35, desc: 'Learn a local craft from an expert artisan.' },
  { name: 'Evening Cruise', type: 'sightseeing', duration: 90, cost: 55, desc: 'See the city lights from a different perspective.' },
  { name: 'Airport Shuttle', type: 'transport', duration: 45, cost: 25, desc: 'Reliable transfer to your accommodation.' },
  { name: 'Boutique Hotel Stay', type: 'stay', duration: 1440, cost: 150, desc: 'Comfortable and stylish lodging in the heart of town.' },
  { name: 'Street Art Tour', type: 'sightseeing', duration: 100, cost: 10, desc: 'Find the best mural and graffiti spots.' },
]

export default function ActivitySearchPage() {
  const { tripId, stopId } = useParams()
  const navigate = useNavigate()
  
  const [stop, setStop] = useState(null)
  const [selectedType, setSelectedType] = useState('All')
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00')
  const [cost, setCost] = useState('')
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(true)

  const types = ['All', 'Sightseeing', 'Food', 'Adventure', 'Transport', 'Stay']

  useEffect(() => {
    fetchStopDetails()
  }, [stopId])

  const fetchStopDetails = async () => {
    try {
      const { data, error } = await supabase.from('stops').select('*').eq('id', stopId).single()
      if (error) throw error
      setStop(data)
      setDate(data.start_date || '')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddActivity = async () => {
    if (!selectedActivity || !date) return
    
    setAdding(true)
    try {
      const { error } = await supabase.from('activities').insert([{
        stop_id: stopId,
        name: selectedActivity.name,
        description: selectedActivity.desc,
        category: selectedActivity.type,
        cost: cost ? parseFloat(cost) : selectedActivity.cost,
        scheduled_time: time
      }])
      
      if (error) throw error
      navigate(`/trips/${tripId}/builder`)
    } catch (err) {
      console.error(err)
    } finally {
      setAdding(false)
    }
  }

  const filteredActivities = GENERIC_ACTIVITIES.filter(a => 
    selectedType === 'All' || a.type.toLowerCase() === selectedType.toLowerCase()
  )

  const getIcon = (type) => {
    switch(type) {
      case 'sightseeing': return <Camera size={18} />
      case 'food': return <Utensils size={18} />
      case 'adventure': return <Map size={18} />
      case 'transport': return <Train size={18} />
      case 'stay': return <Home size={18} />
      default: return <Plus size={18} />
    }
  }

  const getTypeStyle = (type) => {
    switch(type) {
      case 'sightseeing': return 'badge-teal'
      case 'food': return 'badge-accent'
      case 'adventure': return 'badge-primary'
      case 'transport': return 'bg-blue-50 text-blue-700'
      case 'stay': return 'bg-indigo-50 text-indigo-700'
      default: return 'bg-gray-100'
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)]">
      <Loader2 className="animate-spin text-[var(--color-primary)] mb-4" size={48} />
      <p className="text-[var(--color-text-muted)] animate-pulse">Scouting for things to do...</p>
    </div>
  )

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4 hover:gap-3 transition-all">
          <ArrowLeft size={14} /> Back to Builder
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-5xl font-bold text-[var(--color-secondary)]">Plan Activities</h1>
            <p className="text-[var(--color-text-muted)] text-lg mt-2">Discover what to do in {stop?.city_name}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-hide">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all border ${
              selectedType === type 
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg scale-105' 
                : 'bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary-soft)]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredActivities.map((activity, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={activity.name}
            className="card flex flex-col group hover:shadow-xl transition-all duration-300 border-[var(--color-border)]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 rounded-2xl ${getTypeStyle(activity.type)}`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-lg text-[var(--color-secondary)]">
                  {activity.cost === 0 ? 'Free' : `$${activity.cost}`}
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest">Est. Cost</span>
              </div>
            </div>

            <h3 className="font-display text-2xl font-bold text-[var(--color-secondary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
              {activity.name}
            </h3>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-6 flex-1">
              {activity.desc}
            </p>

            <div className="flex items-center gap-4 text-xs font-bold text-[var(--color-text-muted)] mb-8 bg-[var(--color-bg)]/50 p-2 rounded-lg">
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-[var(--color-accent)]" /> {activity.duration}m
              </div>
              <div className="w-1 h-1 rounded-full bg-[var(--color-border)]"></div>
              <div className="capitalize">{activity.type}</div>
            </div>

            <button 
              onClick={() => { setSelectedActivity(activity); setCost(activity.cost.toString()); }}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 group/btn"
            >
              Add to Itinerary <Plus size={18} className="group-hover/btn:rotate-90 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedActivity(null)}
                className="absolute top-6 right-6 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 ${getTypeStyle(selectedActivity.type)}`}>
                  {getIcon(selectedActivity.type)}
                </div>
                <h2 className="font-display text-3xl font-bold text-[var(--color-secondary)]">Schedule it</h2>
                <p className="text-[var(--color-text-muted)]">Customize your {selectedActivity.name}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">When?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="date" 
                      className="input-field text-sm" 
                      min={stop?.start_date}
                      max={stop?.end_date}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    <input 
                      type="time" 
                      className="input-field text-sm" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Estimated Cost ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4" />
                    <input 
                      type="number" 
                      className="input-field pl-10" 
                      placeholder="0.00"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleAddActivity}
                  disabled={adding || !date}
                  className="w-full btn-primary py-4 text-lg shadow-xl flex items-center justify-center gap-2 group"
                >
                  {adding ? <Loader2 className="animate-spin" /> : (
                    <>
                      Add to Plan <Check className="group-hover:scale-125 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
