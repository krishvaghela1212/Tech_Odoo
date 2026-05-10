import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'motion/react'
import { Search, MapPin, Globe, Star, Plus, X, Loader2, ArrowLeft } from 'lucide-react'

export default function CitySearchPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [selectedCity, setSelectedCity] = useState(null)
  
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [customCity, setCustomCity] = useState({ name: '', country: '', img: '' })
  
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [adding, setAdding] = useState(false)

  const regions = ['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Middle East']

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('cities').select('*').order('popularity', { ascending: false })
      if (error) throw error
      setCities(data || [])
    } catch (err) {
      console.error('Error fetching cities:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          city.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === 'All' || city.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  const handleAddStop = async () => {
    const cityData = isCustomMode ? customCity : selectedCity
    if (!cityData || !cityData.name || !startDate || !endDate) return
    
    setAdding(true)
    try {
      const { data: currentStops } = await supabase.from('stops').select('order_index').eq('trip_id', tripId)
      const nextIndex = (currentStops?.length || 0)
      
      const { error } = await supabase.from('stops').insert([{
        trip_id: tripId,
        city_name: cityData.name,
        country: cityData.country,
        image_url: cityData.img || cityData.image_url,
        start_date: startDate,
        end_date: endDate,
        order_index: nextIndex
      }])
      
      if (error) throw error
      navigate(`/trips/${tripId}/builder`)
    } catch (err) {
      console.error('Error adding stop:', err)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4 hover:gap-3 transition-all">
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="font-display text-5xl font-bold text-[var(--color-secondary)]">Where to?</h1>
          <p className="text-[var(--color-text-muted)] text-lg mt-2">Discover destinations for your itinerary</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="flex-[2]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-6 h-6" />
            <input 
              type="text" 
              placeholder="Search by city or country..." 
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl pl-14 py-5 text-[var(--color-text)] font-bold focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]/20 transition-all text-lg shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {regions.map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-6 py-4 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${
                selectedRegion === region 
                  ? 'bg-[var(--color-primary)] text-[var(--color-bg)] border-[var(--color-primary)] shadow-lg' 
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-text)]'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Manual Entry Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsCustomMode(true)}
          className="card flex flex-col items-center justify-center py-12 border-dashed border-2 border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)]/5 hover:bg-[var(--color-primary-soft)]/10 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-primary)] mb-4 group-hover:scale-110 transition-transform shadow-lg">
            <Plus size={32} />
          </div>
          <h3 className="font-display text-xl font-bold text-[var(--color-secondary)]">Add Custom City</h3>
          <p className="text-[var(--color-text-muted)] text-sm text-center mt-2 px-6">Can't find your destination? Add it manually.</p>
        </motion.div>

        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="card h-80 animate-pulse bg-[var(--color-surface)]/50"></div>
          ))
        ) : (
          filteredCities.map((city, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={city.id || city.name}
              className="card p-0 overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={city.image_url || city.img} 
                  alt={city.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm font-bold text-[var(--color-text)] text-xs">
                  <Star size={12} className="text-[var(--color-accent)] fill-[var(--color-accent)]" /> {city.popularity || 80}%
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80">
                    <Globe size={12} /> {city.region || 'Global'}
                  </div>
                  <h3 className="font-display text-2xl font-bold">{city.name}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[var(--color-text-muted)] font-medium italic">{city.country}</span>
                  <span className="text-[var(--color-accent)] font-bold text-lg">
                    {'$'.repeat(city.cost_index || 2)}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedCity(city)}
                  className="w-full py-3 rounded-xl border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold hover:bg-[var(--color-primary)] hover:text-white transition-all flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-[var(--color-primary)]/20"
                >
                  Add Stop <Plus size={18} className="group-hover/btn:rotate-90 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Stop Modal (For DB Cities) */}
      <AnimatePresence>
        {selectedCity && !isCustomMode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedCity(null)}
                className="absolute top-8 right-8 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-[var(--color-bg)] rounded-[2rem] border border-[var(--color-border)] flex items-center justify-center mx-auto mb-6 text-[var(--color-primary)] shadow-inner">
                  <MapPin size={40} />
                </div>
                <h2 className="font-display text-4xl font-bold text-[var(--color-secondary)] italic mb-2">Visit {selectedCity.name}</h2>
                <p className="text-[var(--color-text-muted)] text-sm font-medium">Select your dates for this stop.</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="label text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Arrival</label>
                    <input type="date" className="input-field py-4" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="label text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Departure</label>
                    <input type="date" className="input-field py-4" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
                <button onClick={handleAddStop} disabled={adding} className="w-full btn-primary py-4 text-lg">
                  {adding ? <Loader2 className="animate-spin" /> : 'Confirm Selection'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual Custom City Modal */}
      <AnimatePresence>
        {isCustomMode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <button 
                onClick={() => setIsCustomMode(false)}
                className="absolute top-8 right-8 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[var(--color-primary-soft)]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-[var(--color-primary)]">
                  <Plus size={40} />
                </div>
                <h2 className="font-display text-4xl font-bold text-[var(--color-secondary)] italic mb-2">Add New City</h2>
                <p className="text-[var(--color-text-muted)] text-sm font-medium">Manually enter a custom destination.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="label text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 ml-1">City Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Nathdwara" 
                    className="input-field py-4"
                    value={customCity.name}
                    onChange={(e) => setCustomCity({...customCity, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2 ml-1">Country</label>
                  <input 
                    type="text" 
                    placeholder="e.g. India" 
                    className="input-field py-4"
                    value={customCity.country}
                    onChange={(e) => setCustomCity({...customCity, country: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="label text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Arrival</label>
                    <input type="date" className="input-field py-4" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="label text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Departure</label>
                    <input type="date" className="input-field py-4" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
                <button 
                  onClick={handleAddStop} 
                  disabled={adding || !customCity.name || !startDate || !endDate} 
                  className="w-full btn-primary py-4 text-lg shadow-xl shadow-[var(--color-primary-soft)]/20"
                >
                  {adding ? <Loader2 className="animate-spin" /> : 'Add Destination'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
