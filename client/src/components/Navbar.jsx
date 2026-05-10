import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Map as MapIcon, 
  User as UserIcon, 
  LogOut, 
  Plus, 
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // Hide navbar on public itinerary page and landing? 
  // No, let's keep it but simplified.
  const isPublicPage = location.pathname.startsWith('/shared/')
  if (isPublicPage) return null

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-xl border-b border-[var(--color-border)] px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div className="p-2 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <MapIcon size={20} />
          </div>
          <span className="font-display text-2xl font-bold text-[var(--color-text)] italic">Traveloop</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === '/dashboard' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === '/profile' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
              >
                Profile
              </Link>
              <div className="h-6 w-px bg-[var(--color-border)]"></div>
              <button 
                onClick={handleSignOut}
                className="text-sm font-bold uppercase tracking-widest text-[var(--color-danger)] opacity-70 hover:opacity-100 transition-all flex items-center gap-2"
              >
                <LogOut size={16} /> Sign Out
              </button>
              <Link to="/create-trip" className="btn-primary flex items-center gap-2 py-2 px-6">
                <Plus size={18} /> New Trip
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                Login
              </Link>
              <Link to="/signup" className="btn-primary py-2 px-8">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-[var(--color-secondary)]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-4 -mx-6 px-6 py-6 space-y-4"
          >
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--color-bg)] font-bold text-[var(--color-secondary)]">
                  <LayoutDashboard size={20} /> Dashboard
                </Link>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--color-bg)] font-bold text-[var(--color-secondary)]">
                  <UserIcon size={20} /> Profile
                </Link>
                <Link to="/create-trip" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold">
                  <Plus size={20} /> New Trip
                </Link>
                <button 
                  onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl text-[var(--color-danger)] font-bold"
                >
                  <LogOut size={20} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block p-4 font-bold text-center border border-[var(--color-border)] rounded-2xl">Login</Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block p-4 font-bold text-center bg-[var(--color-primary)] text-white rounded-2xl">Sign Up</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
