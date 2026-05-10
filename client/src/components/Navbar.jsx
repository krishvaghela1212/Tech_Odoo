import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Map as MapIcon, 
  User as UserIcon, 
  LogOut, 
  Plus, 
  LayoutDashboard,
  Menu,
  X,
  ShieldCheck,
  Settings,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const { theme, toggleTheme } = useTheme()

  const isPublicPage = location.pathname.startsWith('/shared/')
  if (isPublicPage) return null

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Trips', path: '/trips', icon: MapIcon },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ]

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin', icon: ShieldCheck })
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${isScrolled ? 'md:pt-4' : 'md:pt-6'}`}>
      <div className={`container mx-auto max-w-7xl transition-all duration-500 ${isScrolled ? 'bg-[var(--color-bg)]/80 backdrop-blur-xl shadow-2xl border border-[var(--color-border)] rounded-2xl py-3 px-6' : 'bg-transparent py-2'}`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="p-2.5 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-[var(--color-bg)] rounded-xl shadow-lg"
            >
              <MapIcon size={22} strokeWidth={2.5} />
            </motion.div>
            <span className="font-display text-2xl font-black text-[var(--color-text)] italic tracking-tighter group-hover:text-[var(--color-primary)] transition-colors">
              Traveloop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center bg-[var(--color-surface)]/60 p-1.5 rounded-xl border border-[var(--color-border)] mr-2">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.path}
                      to={link.path}
                      className={`relative px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 rounded-lg group ${
                        location.pathname === link.path ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      {location.pathname === link.path && (
                        <motion.div 
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-[var(--color-primary-soft)]/20 rounded-lg -z-10"
                          transition={{ type: 'spring', bounce: 0.1, duration: 0.5 }}
                        />
                      )}
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={toggleTheme}
                    className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all hover:scale-105"
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  </button>

                  <Link to="/trips/new" className="btn-primary flex items-center gap-2 py-2.5 px-6 shadow-[0_0_20px_rgba(212,168,67,0.2)] hover:shadow-[0_0_30px_rgba(212,168,67,0.4)] transition-all">
                    <Plus size={18} strokeWidth={3} />
                    <span className="font-bold uppercase tracking-widest text-[10px]">Plan Journey</span>
                  </Link>

                  <div className="relative">
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="w-10 h-10 rounded-full border-2 border-[var(--color-border)] overflow-hidden hover:border-[var(--color-primary)] transition-all bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                    >
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={20} />
                      )}
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                          >
                            <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]/50">
                              <p className="text-xs font-bold text-[var(--color-text)] truncate">{user.full_name || 'Voyager'}</p>
                              <p className="text-[10px] text-[var(--color-text-muted)] truncate">{user.email}</p>
                            </div>
                            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg)] transition-all">
                              <Settings size={16} /> Account Settings
                            </Link>
                            <button 
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-all border-t border-[var(--color-border)]"
                            >
                              <LogOut size={16} /> Sign Out
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary py-2.5 px-8 shadow-xl">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-[var(--color-secondary)] hover:bg-[var(--color-surface)] rounded-xl transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-0 z-40 md:hidden bg-[var(--color-bg)] flex flex-col p-8 pt-24"
          >
            <div className="flex flex-col gap-4">
              {user ? (
                <>
                  <div className="mb-8 p-6 bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-bg)] font-black text-2xl shadow-xl">
                      {user.full_name?.charAt(0) || 'V'}
                    </div>
                    <div>
                      <div className="font-display text-xl font-bold">{user.full_name || 'Voyager'}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">{user.email}</div>
                    </div>
                  </div>

                  {navLinks.map((link) => (
                    <Link 
                      key={link.path}
                      to={link.path} 
                      onClick={() => setIsMenuOpen(false)} 
                      className={`flex items-center gap-4 p-5 rounded-2xl font-bold transition-all ${
                        location.pathname === link.path ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'bg-[var(--color-surface)] text-[var(--color-secondary)]'
                      }`}
                    >
                      <link.icon size={20} /> {link.name}
                    </Link>
                  ))}

                  {/* Theme Toggle Mobile */}
                  <button 
                    onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--color-surface)] text-[var(--color-secondary)] font-bold transition-all"
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>

                  <div className="h-px bg-[var(--color-border)] my-4"></div>

                  <Link to="/trips/new" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--color-primary)] text-white font-bold shadow-2xl">
                    <Plus size={20} /> Plan New Trip
                  </Link>
                  <button 
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-4 p-5 rounded-2xl text-[var(--color-danger)] font-bold bg-[var(--color-danger)]/5"
                  >
                    <LogOut size={20} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block p-6 font-bold text-center border border-[var(--color-border)] rounded-2xl text-xl">Login</Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block p-6 font-bold text-center bg-[var(--color-primary)] text-white rounded-2xl text-xl shadow-2xl">Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
