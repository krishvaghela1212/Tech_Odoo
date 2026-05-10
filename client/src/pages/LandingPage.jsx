import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { 
  MapPin, 
  Calendar, 
  Wallet, 
  Search, 
  Share2, 
  CheckSquare, 
  ChevronDown, 
  ArrowRight, 
  Zap, 
  Globe, 
  Map as MapIcon,
  Navigation,
  Compass,
  Trophy
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden font-body bg-[var(--color-bg)]">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Layered Overlays */}
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1, x: 0 }}
            animate={{ 
              scale: 1.15,
              x: [-10, 10, -10]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "linear"
            }}
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2600" 
            alt="Luxury Travel" 
            className="w-full h-full object-cover opacity-30 grayscale-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg)]/80 to-[var(--color-bg)]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-transparent to-[var(--color-bg)]/20"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="badge-accent badge py-1 text-sm mb-6 shadow-sm border border-[var(--color-accent)]/20">Your multi-city compass</span>
            <h1 className="font-display leading-[0.8] mb-8">
              <span className="block text-[var(--color-secondary)] italic text-6xl md:text-8xl lg:text-[10rem]">Plan Less.</span>
              <span className="block text-[var(--color-primary)] font-bold text-6xl md:text-8xl lg:text-[10rem] mt-4">Wander More.</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-[var(--color-text-muted)] text-lg md:text-2xl max-w-2xl mx-auto mt-12 font-light leading-relaxed"
          >
            Traveloop turns complex itineraries into a beautifully organized journey. 
            All your stops, activities, and budgets in one perfect loop.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mt-16"
          >
            <Link to="/signup" className="btn-primary text-xl px-12 py-5 shadow-2xl flex items-center gap-3">
              Start Planning Free <ArrowRight size={24} />
            </Link>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-5 rounded-xl border-2 border-[var(--color-border)] text-[var(--color-secondary)] font-bold hover:bg-[var(--color-surface-alt)] transition-all bg-white/50 backdrop-blur-sm shadow-xl"
            >
              See How It Works
            </button>
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--color-primary)] opacity-40"
        >
          <ChevronDown size={40} />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[var(--color-surface)] py-16 border-y border-[var(--color-border)] relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 max-w-5xl mx-auto">
            {[
              { num: "14+", label: "Rich UI Components" },
              { num: "Live", label: "Relational Planning" },
              { num: "Pro", label: "Shareable Itineraries" }
            ].map((stat, i) => (
              <div key={i} className="text-center flex-1 w-full md:w-auto relative group">
                <div className="font-display text-[var(--color-accent)] text-5xl md:text-7xl font-bold group-hover:scale-110 transition-transform duration-500">{stat.num}</div>
                <div className="text-[var(--color-text-muted)] font-bold mt-2 tracking-[0.2em] uppercase text-[10px]">{stat.label}</div>
                {i < 2 && <div className="hidden md:block absolute right-[-2.5rem] top-1/2 -translate-y-1/2 h-12 w-[1px] bg-[var(--color-border)]"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-[var(--color-surface-alt)]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-24">
             <h2 className="font-display text-5xl md:text-7xl text-[var(--color-text)] mb-8 italic">Everything Your<br/>Trip Needs</h2>
             <p className="text-[var(--color-text-muted)] text-lg">A suite of specialized tools designed for the modern explorer.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Navigation size={28} />, title: "Multi-City Routes", desc: "Plan seamless transitions across any number of destinations." },
              { icon: <Calendar size={28} />, title: "Precision Scheduling", desc: "Assign specific times and costs to every daily activity." },
              { icon: <Wallet size={28} />, title: "Visual Budgets", desc: "See where your money goes with automatic cost breakdowns." },
              { icon: <Search size={28} />, title: "Global Discovery", desc: "Integrated lookup for cities and things to do anywhere." },
              { icon: <Share2 size={28} />, title: "Shared Inspiration", desc: "Generate aesthetic public links for your community." },
              { icon: <CheckSquare size={28} />, title: "Packing Logic", desc: "Maintain structured checklists so you're always ready." }
            ].map((f, i) => (
              <motion.div 
                whileHover={{ y: -8 }}
                key={i} 
                className="card bg-[var(--color-surface)] text-left p-12 flex flex-col items-start gap-6 border-none shadow-2xl"
              >
                <div className="p-4 bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded-2xl">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-3">{f.title}</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed italic">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-[var(--color-bg)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent-soft)] rounded-full blur-[120px] opacity-20 -mr-48 -mt-48"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="font-display text-5xl md:text-6xl text-center mb-24 italic text-[var(--color-text)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-8">Idea to Itinerary</h2>
          
          <div className="relative">
            <div className="hidden lg:block absolute top-[2.5rem] left-[15%] right-[15%] border-t-2 border-dashed border-[var(--color-border)] z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
              {[
                { step: <Compass size={32} />, title: "Initiate", desc: "Set your anchors with a trip name and dates." },
                { step: <MapPin size={32} />, title: "Anchor", desc: "Build your route by adding unique city stops." },
                { step: <Zap size={32} />, title: "Polish", desc: "Fill your days with sights, eats, and experiences." },
                { step: <Trophy size={32} />, title: "Loop", desc: "Share your aesthetic itinerary with the world." }
              ].map((s, i) => (
                <div key={i} className="text-center group">
                  <div className="w-24 h-24 bg-[var(--color-primary)] text-[var(--color-bg)] rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:rotate-6 transition-all shadow-2xl border-4 border-[var(--color-surface)]">
                    {s.step}
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3 italic text-[var(--color-text)]">{s.title}</h3>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed px-4">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="bg-[var(--color-secondary)] py-32 px-6 relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="font-display italic text-4xl md:text-6xl text-white leading-tight font-bold">
            "The world is a book; travel is the reading."
          </p>
          <div className="flex items-center justify-center gap-4 mt-12 text-[var(--color-accent)]">
            <div className="w-12 h-px bg-[var(--color-accent)]/30"></div>
            <p className="font-bold text-lg tracking-[0.3em] uppercase">Saint Augustine</p>
            <div className="w-12 h-px bg-[var(--color-accent)]/30"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-bg)] border-t border-[var(--color-border)] py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-8 group">
                <div className="p-2 bg-[var(--color-primary)] text-white rounded-xl group-hover:rotate-12 transition-transform duration-300">
                  <MapIcon size={24} />
                </div>
                <span className="font-display text-4xl font-bold text-[var(--color-secondary)] italic">Traveloop</span>
              </Link>
              <p className="text-[var(--color-text-muted)] max-w-sm text-lg italic leading-relaxed">
                Empowering the modern traveler to architect complex journeys with beauty and mathematical precision.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-display text-xl font-bold text-[var(--color-secondary)]">Navigate</h4>
              <nav className="flex flex-col gap-4">
                <Link to="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all font-medium">Home</Link>
                <Link to="/login" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all font-medium">Port de Login</Link>
                <Link to="/signup" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all font-medium">Join the Loop</Link>
              </nav>
            </div>

            <div className="space-y-6">
              <h4 className="font-display text-xl font-bold text-[var(--color-secondary)]">Collectives</h4>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                Built for the 2025 Odoo Hackathon.<br/>
                React • Supabase • Tailwind • Motion
              </p>
              <div className="pt-4 flex gap-4 text-[var(--color-text-muted)]">
                 <button className="hover:text-[var(--color-primary)] transition-colors"><Globe size={20}/></button>
                 <button className="hover:text-[var(--color-primary)] transition-colors"><MapPin size={20}/></button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[var(--color-border)] pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-muted)]">
            <p>© 2025 TRAVELOOP ITINERARY ARCHITECTS. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
               <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
