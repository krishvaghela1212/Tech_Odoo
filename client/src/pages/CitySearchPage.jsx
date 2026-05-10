import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'motion/react'
import { Search, MapPin, Globe, Star, Plus, X, Loader2, ArrowLeft } from 'lucide-react'

const CITIES = [
  { name: 'Paris', country: 'France', region: 'Europe', cost_index: 3, popularity: 95, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=60' },
  { name: 'Bangkok', country: 'Thailand', region: 'Asia', cost_index: 1, popularity: 90, img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579367?w=800&auto=format&fit=crop&q=60' },
  { name: 'Tokyo', country: 'Japan', region: 'Asia', cost_index: 3, popularity: 98, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=60' },
  { name: 'Istanbul', country: 'Turkey', region: 'Middle East', cost_index: 2, popularity: 88, img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop&q=60' },
  { name: 'Lisbon', country: 'Portugal', region: 'Europe', cost_index: 2, popularity: 85, img: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&auto=format&fit=crop&q=60' },
  { name: 'Bali', country: 'Indonesia', region: 'Asia', cost_index: 1, popularity: 92, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60' },
  { name: 'New York', country: 'USA', region: 'Americas', cost_index: 3, popularity: 97, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=60' },
  { name: 'Cape Town', country: 'South Africa', region: 'Africa', cost_index: 2, popularity: 83, img: 'https://images.unsplash.com/photo-1580619305118-857588562d96?w=800&auto=format&fit=crop&q=60' },
  { name: 'London', country: 'UK', region: 'Europe', cost_index: 3, popularity: 96, img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=60' },
  { name: 'Seoul', country: 'South Korea', region: 'Asia', cost_index: 2, popularity: 91, img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=60' },
  { name: 'Barcelona', country: 'Spain', region: 'Europe', cost_index: 2, popularity: 93, img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&auto=format&fit=crop&q=60' },
  { name: 'Dubai', country: 'UAE', region: 'Middle East', cost_index: 3, popularity: 94, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=60' },
  { name: 'Amsterdam', country: 'Netherlands', region: 'Europe', cost_index: 3, popularity: 89, img: 'https://images.unsplash.com/photo-1512470876302-972fad2aa9dd?w=800&auto=format&fit=crop&q=60' },
  { name: 'Rio de Janeiro', country: 'Brazil', region: 'Americas', cost_index: 2, popularity: 87, img: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&auto=format&fit=crop&q=60' },
  { name: 'Sydney', country: 'Australia', region: 'Americas', cost_index: 3, popularity: 95, img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop&q=60' },
]

export default function CitySearchPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [selectedCity, setSelectedCity] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [adding, setAdding] = useState(false)

  const regions = ['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Middle East']

  const filteredCities = CITIES.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          city.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === 'All' || city.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  const handleAddStop = async () => {
    if (!selectedCity || !startDate || !endDate) return
    
    setAdding(true)
    try {
      const { data: currentStops } = await supabase.from('stops').select('order_index').eq('trip_id', tripId)
      const nextIndex = (currentStops?.length || 0)
      
      const { error } = await supabase.from('stops').insert([{
        trip_id: tripId,
        city_name: selectedCity.name,
        country: selectedCity.country,
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
              className="input-field pl-14 py-4 text-lg bg-white shadow-sm border-[var(--color-border)] focus:ring-4 ring-[var(--color-primary-soft)]/30"
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
                  ? 'bg-[var(--color-secondary)] text-white border-[var(--color-secondary)] shadow-lg' 
                  : 'bg-white text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredCities.map((city, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={city.name}
            className="card p-0 overflow-hidden group hover:shadow-2xl transition-all duration-500 border-[var(--color-border)]"
          >
            <div className="relative h-56 overflow-hidden">
              <img 
                src={city.img} 
                alt={city.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm font-bold text-xs">
                <Star size={12} className="text-[var(--color-accent)] fill-[var(--color-accent)]" /> {city.popularity}%
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80">
                  <Globe size={12} /> {city.region}
                </div>
                <h3 className="font-display text-2xl font-bold">{city.name}</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[var(--color-text-muted)] font-medium">{city.country}</span>
                <span className="text-[var(--color-accent)] font-bold text-lg">
                  {'$'.repeat(city.cost_index)}
                </span>
              </div>
              <button 
                onClick={() => setSelectedCity(city)}
                className="w-full py-3 rounded-xl border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold hover:bg-[var(--color-primary)] hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
              >
                Add Stop <Plus size={18} className="group-hover/btn:rotate-90 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Stop Modal */}
      <AnimatePresence>
        {selectedCity && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedCity(null)}
                className="absolute top-6 right-6 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[var(--color-bg)] rounded-3xl flex items-center justify-center mx-auto mb-4 text-[var(--color-primary)]">
                  <MapPin size={40} />
                </div>
                <h2 className="font-display text-3xl font-bold text-[var(--color-secondary)]">Visit {selectedCity.name}</h2>
                <p className="text-[var(--color-text-muted)]">When will you be staying in {selectedCity.name}?</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Arrival</label>
                    <input 
                      type="date" 
                      className="input-field" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Departure</label>
                    <input 
                      type="date" 
                      className="input-field" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleAddStop}
                  disabled={adding || !startDate || !endDate}
                  className="w-full btn-primary py-4 text-lg shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {adding ? <Loader2 className="animate-spin" /> : 'Confirm Selection'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
