import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ExternalLink, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

export default function TripCard({ trip }) {
  const stopCount = trip.stops?.[0]?.count ?? trip.stops?.length ?? 0
  const fallbackImage = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800`
  
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="card flex flex-col p-0 overflow-hidden group border border-[var(--color-border)] shadow-sm hover:shadow-xl transition-all duration-300 h-full"
    >
      <Link to={`/trips/${trip.id}/view`} className="relative h-48 overflow-hidden block">
        <img 
          src={trip.cover_photo_url || fallbackImage} 
          alt={trip.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
          onError={(e) => {
            if (e.target.src !== fallbackImage) {
              e.target.src = fallbackImage
            }
          }}
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {trip.is_public && (
            <span className="badge bg-white/90 text-[var(--color-secondary)] backdrop-blur shadow-sm flex items-center gap-1">
              <ExternalLink size={12} /> Public
            </span>
          )}
          <span className="badge-accent badge">
            {stopCount} {stopCount === 1 ? 'Stop' : 'Stops'}
          </span>
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <Link to={`/trips/${trip.id}/view`} className="font-display text-2xl font-bold hover:text-[var(--color-primary)] transition-colors line-clamp-1">
            {trip.name}
          </Link>
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm mt-1">
            <Calendar size={14} className="text-[var(--color-accent)]" />
            <span>
              {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'TBD'}
              {trip.end_date ? ` — ${new Date(trip.end_date).toLocaleDateString()}` : ''}
            </span>
          </div>
        </div>

        {trip.description && (
          <p className="text-[var(--color-text-muted)] text-sm line-clamp-2 mb-6">
            {trip.description}
          </p>
        )}

        <div className="mt-auto flex gap-3 pt-4 border-t border-[var(--color-border)]">
          <Link 
            to={`/trips/${trip.id}/view`} 
            className="flex-1 text-center py-2 text-sm font-medium border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg)] transition-colors"
          >
            View
          </Link>
          <Link 
            to={`/trips/${trip.id}/builder`} 
            className="flex-1 text-center py-2 text-sm font-medium bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-all flex items-center justify-center gap-1 group/btn"
          >
            Edit <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
