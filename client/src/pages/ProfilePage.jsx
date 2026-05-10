import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { motion } from 'motion/react'
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Trash2, 
  LogOut, 
  Loader2, 
  Save,
  CheckCircle,
  ExternalLink
} from 'lucide-react'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '')
  const [language, setLanguage] = useState('English')
  
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [status, setStatus] = useState('idle')
  const [stats, setStats] = useState({ totalTrips: 0, publicTrips: 0, cities: 0 })

  useEffect(() => {
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      const { data: trips } = await supabase.from('trips').select('id, is_public').eq('user_id', user?.id)
      const { data: stops } = await supabase.from('stops').select('city_name').in('trip_id', trips?.map(t => t.id) || [])
      
      const uniqueCities = new Set(stops?.map(s => s.city_name)).size
      
      setStats({
        totalTrips: trips?.length || 0,
        publicTrips: trips?.filter(t => t.is_public).length || 0,
        cities: uniqueCities
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName, avatar_url: avatarUrl }
      })
      if (error) throw error
      
      await supabase.from('profiles').update({ 
        full_name: fullName, 
        avatar_url: avatarUrl,
        language 
      }).eq('id', user?.id)

      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure? This will delete all your trips and account metadata. This cannot be undone.')) return
    
    setDeleting(true)
    try {
      await supabase.from('profiles').delete().eq('id', user?.id)
      await signOut()
      navigate('/')
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl pb-32">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left Sidebar - Profile Summary */}
        <aside className="md:w-1/3">
          <div className="sticky top-24 space-y-6">
            <div className="card text-center p-10 bg-[var(--color-surface)] border-[var(--color-border)] shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-24 bg-[var(--color-bg)] -z-0"></div>
               
               <div className="relative z-10">
                 <div className="w-32 h-32 rounded-full border-4 border-white bg-[var(--color-primary)] mx-auto mb-6 flex items-center justify-center text-white text-5xl font-display font-bold shadow-2xl overflow-hidden ring-4 ring-[var(--color-primary-soft)]/30">
                   {avatarUrl ? (
                     <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                   ) : (
                     fullName.charAt(0) || user?.email?.charAt(0).toUpperCase()
                   )}
                 </div>
                 
                 <h2 className="font-display text-3xl font-bold text-[var(--color-secondary)] mb-1 leading-tight">{fullName || 'Traveler'}</h2>
                 <p className="text-[var(--color-text-muted)] text-sm flex items-center justify-center gap-2 mb-8">
                   <Mail size={14} className="text-[var(--color-accent)]" /> {user?.email}
                 </p>

                 <div className="grid grid-cols-3 gap-2 border-t border-[var(--color-border)] pt-8">
                    <div>
                      <div className="text-2xl font-display font-bold text-[var(--color-primary)]">{stats.totalTrips}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Trips</div>
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-[var(--color-primary)]">{stats.publicTrips}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Shared</div>
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-[var(--color-primary)]">{stats.cities}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Cities</div>
                    </div>
                 </div>
               </div>
            </div>

            <button 
              onClick={() => signOut().then(() => navigate('/'))}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] font-bold hover:text-[var(--color-danger)] hover:border-[var(--color-danger)] transition-all group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Right Content - Settings Form */}
        <main className="md:w-2/3 space-y-10">
          <section className="card shadow-xl border-[var(--color-border)] p-10">
            <h3 className="font-display text-3xl font-bold text-[var(--color-secondary)] mb-8 flex items-center gap-4">
              <UserIcon className="text-[var(--color-accent)]" size={32} /> Personal Information
            </h3>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Display Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="E.g. Elena Wanderlust"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Avatar URL</label>
                  <input 
                    type="url" 
                    className="input-field" 
                    placeholder="https://image-url.com"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Primary Language</label>
                <select 
                  className="input-field"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Japanese</option>
                </select>
              </div>

              <div className="pt-6 flex items-center gap-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary px-10 py-4 shadow-lg flex items-center gap-2 group min-w-[180px] justify-center"
                >
                  {loading ? <Loader2 className="animate-spin" /> : (
                    <>
                      <Save size={18} className="group-hover:scale-110 transition-transform" /> Save Changes
                    </>
                  )}
                </button>
                
                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-[var(--color-success)] font-bold text-sm"
                  >
                    <CheckCircle size={18} /> Profile updated!
                  </motion.div>
                )}
              </div>
            </form>
          </section>

          <section className="card shadow-xl border-[var(--color-border)] p-10">
            <h3 className="font-display text-3xl font-bold text-[var(--color-secondary)] mb-8 flex items-center gap-4">
              <Shield className="text-[var(--color-primary)]" size={32} /> Security & Privacy
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-[var(--color-bg)]/50 rounded-2xl border border-[var(--color-border)]">
                <div>
                  <h4 className="font-bold text-[var(--color-secondary)] mb-1">Public Profile Visibility</h4>
                  <p className="text-sm text-[var(--color-text-muted)]">Control which trips are visible globally from individual trip settings.</p>
                </div>
                <Link to="/trips" className="text-[var(--color-primary)] font-bold text-sm hover:underline flex items-center gap-1">
                  Manage Trips <ExternalLink size={14} />
                </Link>
              </div>

              <div className="pt-10 border-t border-[var(--color-border)]">
                <h4 className="font-display text-2xl font-bold text-[var(--color-danger)] mb-2">Danger Zone</h4>
                <p className="text-[var(--color-text-muted)] mb-6 text-sm">Once you delete your account, there is no going back. Please be certain.</p>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex items-center gap-2 text-[var(--color-danger)] font-bold px-6 py-3 border border-[var(--color-danger)] rounded-xl hover:bg-[var(--color-danger)] hover:text-white transition-all shadow-sm"
                >
                  {deleting ? <Loader2 className="animate-spin" /> : (
                    <>
                      <Trash2 size={18} /> Delete Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
