import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion } from 'motion/react'
import { UserPlus, ArrowRight, Loader2 } from 'lucide-react'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      if (error) throw error
      
      if (data.user && !data.session) {
        setError('Signup successful! Please check your email for a confirmation link before logging in.')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--color-bg)] relative overflow-hidden items-center justify-center p-12 border-r border-[var(--color-border)]">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/world-map.png')] bg-center bg-no-repeat bg-contain filter brightness-150"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface)]/40 to-transparent"></div>
        
        <div className="relative z-10 text-center max-w-lg">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(232,184,109,0.3)]"
          >
            <UserPlus className="w-12 h-12" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl text-[var(--color-text)] mb-8 leading-tight italic font-bold"
          >
            "Explore. Dream. Discover."
          </motion.h2>
          <div className="flex items-center justify-center gap-4">
             <div className="w-12 h-px bg-[var(--color-primary)]/30"></div>
             <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-[var(--color-primary)] font-body tracking-[0.3em] font-bold uppercase text-sm"
              >
                Mark Twain
              </motion.p>
             <div className="w-12 h-px bg-[var(--color-primary)]/30"></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-[150px] opacity-10 -mr-48 -mt-48"></div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md bg-[var(--color-surface)] p-10 rounded-3xl shadow-[0_40px_100_dp_rgba(0,0,0,0.5)] border border-[var(--color-border)] relative z-10"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-display text-4xl font-bold text-[var(--color-text)] mb-3 italic">Create Journal</h1>
            <p className="text-[var(--color-text-muted)] italic">Begin your first chapter in the midnight atlas.</p>
          </div>

          {error && (
            <div className="bg-[var(--color-danger)]/10 border-l-4 border-[var(--color-danger)] p-4 mb-8 rounded-r-xl">
              <p className="text-[var(--color-danger)] text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3 ml-1">Chronicler Name</label>
              <input 
                type="text" 
                required 
                className="input-field" 
                placeholder="Marco Polo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3 ml-1">Archive Email</label>
              <input 
                type="email" 
                required 
                className="input-field" 
                placeholder="voyager@atlas.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3 ml-1">Private Key</label>
                <input 
                  type="password" 
                  required 
                  className="input-field" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3 ml-1">Verify</label>
                <input 
                  type="password" 
                  required 
                  className="input-field" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <p className="text-[10px] text-[var(--color-text-muted)] mt-4 leading-relaxed italic uppercase tracking-[0.05em]">
              By initiating this journal, you agree to the laws of the Atlas and its privacy protocols.
            </p>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-3 group mt-8 shadow-2xl"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span className="font-bold uppercase tracking-widest text-sm">Join the Loop</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-[var(--color-border)] text-center">
            <p className="text-[var(--color-text-muted)] text-xs mb-4 uppercase tracking-[0.1em]">Already archived?</p>
            <Link to="/login" className="text-[var(--color-primary)] font-bold hover:text-[var(--color-secondary)] transition-colors italic text-lg">
              Sign into your atlas
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
