import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'motion/react'
import { 
  Users, 
  Map, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Calendar,
  MoreHorizontal,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrips: 0,
    totalCities: 0,
    activeToday: 0
  })
  const [users, setUsers] = useState([])
  const [topCities, setTopCities] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    setLoading(true)
    // STATIC MODE: Mock platform-wide stats
    setTimeout(() => {
      setStats({
        totalUsers: 124,
        totalTrips: 342,
        totalCities: 156,
        activeToday: 48
      })

      setUsers([
        { id: '1', full_name: 'Elena Wanderlust', email: 'elena@example.com', role: 'user', updated_at: new Date().toISOString() },
        { id: '2', full_name: 'Marco Polo', email: 'marco@voyager.com', role: 'user', updated_at: new Date().toISOString() },
        { id: '3', full_name: 'Admin Krish', email: 'admin@traveloop.com', role: 'admin', updated_at: new Date().toISOString() },
        { id: '4', full_name: 'Sarah Explorer', email: 'sarah@trips.com', role: 'user', updated_at: new Date().toISOString() },
        { id: '5', full_name: 'James Cook', email: 'james@ocean.com', role: 'user', updated_at: new Date().toISOString() },
      ])

      setTopCities([
        { name: 'Paris', count: 42 },
        { name: 'Tokyo', count: 38 },
        { name: 'Rome', count: 25 },
        { name: 'New York', count: 18 },
        { name: 'London', count: 15 },
      ])

      setChartData([
        { name: 'Mon', trips: 12, users: 5 },
        { name: 'Tue', trips: 19, users: 8 },
        { name: 'Wed', trips: 15, users: 12 },
        { name: 'Thu', trips: 22, users: 15 },
        { name: 'Fri', trips: 30, users: 18 },
        { name: 'Sat', trips: 45, users: 25 },
        { name: 'Sun', trips: 38, users: 22 },
      ])

      setLoading(false)
    }, 500)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-[var(--color-secondary)]">Platform Analytics</h1>
          <p className="text-[var(--color-text-muted)] italic">Global monitoring of the Traveloop ecosystem.</p>
        </div>
        <div className="px-4 py-2 bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck size={14} /> Admin Access Verified
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Explorers', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
          { label: 'Global Voyages', value: stats.totalTrips, icon: Map, color: 'text-[var(--color-primary)]' },
          { label: 'Saved Anchors', value: stats.totalCities, icon: Activity, color: 'text-[var(--color-accent)]' },
          { label: 'Active Voyagers', value: stats.activeToday, icon: TrendingUp, color: 'text-green-500' },
        ].map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-6 flex items-center gap-6"
          >
            <div className={`p-4 rounded-2xl bg-[var(--color-bg)] ${s.color}`}>
              <s.icon size={28} />
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-[var(--color-secondary)]">{s.value}</div>
              <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-8 h-[450px] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display text-xl font-bold">Growth Trends</h3>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div> Trips</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div> Users</span>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'var(--color-text-muted)', fontSize: 12}}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'var(--color-text-muted)', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-surface)', 
                    borderColor: 'var(--color-border)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="trips" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTrips)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="var(--color-accent)" 
                  strokeWidth={3}
                  fillOpacity={0} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-8 flex flex-col">
          <h3 className="font-display text-xl font-bold mb-8">Top Destinations</h3>
          <div className="space-y-6 flex-1">
            {topCities.map((city, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>{city.name}</span>
                  <span className="text-[var(--color-primary)]">{city.count} trips</span>
                </div>
                <div className="h-2 bg-[var(--color-bg)] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(city.count / topCities[0].count) * 100}%` }}
                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]"
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary-soft)] rounded-xl hover:bg-[var(--color-primary)] hover:text-white transition-all">
            Full Geo-Report
          </button>
        </div>
      </div>

      {/* User Management & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-0 overflow-hidden">
          <div className="p-8 border-b border-[var(--color-border)] flex justify-between items-center">
            <h3 className="font-display text-xl font-bold">Recent Signups</h3>
            <button className="text-[var(--color-primary)]"><MoreHorizontal size={20}/></button>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {users.map((u, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-[var(--color-bg)]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary-soft)] to-[var(--color-primary)] flex items-center justify-center text-white font-bold">
                    {u.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-[var(--color-secondary)]">{u.full_name || 'Anonymous Voyager'}</div>
                    <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                      <Calendar size={12} /> Joined {new Date(u.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                    {u.role}
                  </span>
                  <ChevronRight size={18} className="text-[var(--color-border)]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-8">
          <h3 className="font-display text-xl font-bold mb-8">System Health</h3>
          <div className="space-y-8">
            {[
              { label: 'Supabase API Response', status: 'Healthy', time: '142ms', color: 'text-green-500' },
              { label: 'Storage Utilization', status: 'Optimal', time: '2.4 GB / 10 GB', color: 'text-blue-500' },
              { label: 'Email Service', status: 'Operational', time: '99.9% Uptime', color: 'text-green-500' },
              { label: 'Gemini AI Processing', status: 'Active', time: 'Average 1.2s', color: 'text-purple-500' },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${s.color.replace('text', 'bg')} animate-pulse`}></div>
                  <div>
                    <div className="font-bold text-sm text-[var(--color-secondary)]">{s.label}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">{s.status}</div>
                  </div>
                </div>
                <div className="text-xs font-bold font-mono text-[var(--color-text-muted)] bg-[var(--color-bg)] px-3 py-1 rounded-lg">
                  {s.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
