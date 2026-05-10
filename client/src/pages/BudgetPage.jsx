import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion } from 'motion/react'
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts'
import { 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  DollarSign, 
  Loader2,
  PieChart as PieChartIcon
} from 'lucide-react'

const COLORS = ['#C4571A', '#2A4858', '#D4A843', '#2D6A4F', '#6B6560']

export default function BudgetPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  
  const [totalBudget, setTotalBudget] = useState(0)
  const [budgetItems, setBudgetItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState('Misc')
  const [newLabel, setNewLabel] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchBudgetData()
  }, [tripId])

  const fetchBudgetData = async () => {
    setLoading(true)
    try {
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('total_budget')
        .eq('id', tripId)
        .single()
      if (tripError) throw tripError
      setTotalBudget(tripData.total_budget || 0)

      const { data: stopsData, error: stopsError } = await supabase
        .from('stops')
        .select(`activities(name, category, cost)`)
        .eq('trip_id', tripId)
      if (stopsError) throw stopsError

      const allActivities = stopsData.flatMap((stop, stopIndex) =>
        (stop.activities || []).map((act, actIndex) => ({
          id: `${stopIndex}-${actIndex}`,
          category: act.category || 'Misc',
          label: act.name,
          amount: act.cost || 0
        }))
      )
      setBudgetItems(allActivities)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!newLabel || !newAmount) return
    setIsAdding(true)
    try {
      const newItem = {
        id: Date.now().toString(),
        category: newCategory,
        label: newLabel,
        amount: parseFloat(newAmount)
      }
      setBudgetItems([...budgetItems, newItem])
      setNewLabel('')
      setNewAmount('')
    } catch (err) {
      console.error(err)
    } finally {
      setIsAdding(false)
    }
  }

  const deleteItem = (id) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id))
  }

  const totalSpent = budgetItems.reduce((sum, item) => sum + parseFloat(item.amount), 0)
  const remaining = totalBudget - totalSpent
  const isOverBudget = remaining < 0

  const pieData = budgetItems.reduce((acc, item) => {
    const existing = acc.find(a => a.name === item.category)
    if (existing) {
      existing.value += parseFloat(item.amount)
    } else {
      acc.push({ name: item.category, value: parseFloat(item.amount) })
    }
    return acc
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)]">
      <Loader2 className="animate-spin text-[var(--color-primary)] mb-4" size={48} />
      <p className="text-[var(--color-text-muted)] animate-pulse">Calculating your expenses...</p>
    </div>
  )

  return (
    <div className="container mx-auto px-6 py-12 pb-24">
      <div className="mb-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4 hover:gap-3 transition-all">
          <ArrowLeft size={14} /> Back to Itinerary
        </button>
        <h1 className="font-display text-5xl font-bold text-[var(--color-secondary)] underline decoration-[var(--color-accent)] decoration-4 underline-offset-8">Trip Budget</h1>
      </div>

      {isOverBudget && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-12 flex items-center gap-4 shadow-sm"
        >
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="text-red-600" />
          </div>
          <div>
            <p className="font-bold">Over Budget Alert!</p>
            <p className="text-sm opacity-80 text-red-600">You are over your planned budget by ${Math.abs(remaining).toLocaleString()}. Consider adjusting your expenses.</p>
          </div>
        </motion.div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card border-none bg-[var(--color-secondary)] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={80} /></div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Total Budget</p>
          <p className="font-display text-4xl font-bold text-[var(--color-accent)]">${totalBudget.toLocaleString()}</p>
        </div>
        <div className="card shadow-md border-[var(--color-border)]">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Estimated Spend</p>
          <p className="font-display text-4xl font-bold text-[var(--color-primary)]">${totalSpent.toLocaleString()}</p>
        </div>
        <div className={`card shadow-md border-[var(--color-border)] ${isOverBudget ? 'bg-red-50' : 'bg-[var(--color-bg)]/50'}`}>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
            {isOverBudget ? 'Over Budget' : 'Remaining'}
          </p>
          <p className={`font-display text-4xl font-bold ${isOverBudget ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'}`}>
            ${Math.abs(remaining).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Pie Chart */}
        <div className="card shadow-xl border-[var(--color-border)]">
          <h3 className="font-display text-2xl font-bold text-[var(--color-secondary)] mb-6 flex items-center gap-3">
            <PieChartIcon className="text-[var(--color-accent)]" /> 
            Cost Breakdown
          </h3>
          <div className="h-80">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--color-text-muted)] italic">
                Add budget items to see breakdown.
              </div>
            )}
          </div>
        </div>

        {/* Add Items Form */}
        <div className="card shadow-xl border-[var(--color-border)]">
          <h3 className="font-display text-2xl font-bold text-[var(--color-secondary)] mb-6 flex items-center gap-3">
            <TrendingUp className="text-[var(--color-primary)]" />
            Track Expense
          </h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--color-text-muted)] mb-2 tracking-widest">Category</label>
              <select 
                className="input-field"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option>Transport</option>
                <option>Stay</option>
                <option>Activities</option>
                <option>Meals</option>
                <option>Misc</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--color-text-muted)] mb-2 tracking-widest">Description</label>
              <input 
                type="text" 
                placeholder="Flight to Paris, Airbnb in Tokyo..." 
                className="input-field"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--color-text-muted)] mb-2 tracking-widest">Amount ($)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                className="input-field"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isAdding}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 group shadow-xl"
            >
              {isAdding ? <Loader2 className="animate-spin" /> : (
                <>
                  <Plus className="group-hover:rotate-90 transition-transform" /> Add Expense
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Items Table */}
      <div className="card shadow-xl border-[var(--color-border)] overflow-hidden p-0">
        <div className="p-6 border-b border-[var(--color-border)]">
           <h3 className="font-display text-2xl font-bold text-[var(--color-secondary)]">Planned Expenses</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[var(--color-bg)]/50 text-[var(--color-text-muted)] text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Label</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {budgetItems.length > 0 ? budgetItems.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--color-bg)]/20 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    <span className={`badge text-[10px] ${item.category === 'Transport' ? 'badge-teal' : item.category === 'Stay' ? 'badge-primary' : 'badge-accent'}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{item.label}</td>
                  <td className="px-6 py-4 font-bold text-[var(--color-secondary)]">${parseFloat(item.amount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-gray-300 hover:text-[var(--color-danger)] transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[var(--color-text-muted)] italic">
                    No budget items yet. Use the form above to start tracking.
                  </td>
                </tr>
              )}
            </tbody>
            {budgetItems.length > 0 && (
              <tfoot className="bg-[var(--color-bg)]/30 font-bold">
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-sm text-[var(--color-text-muted)]">Total Estimated Spend</td>
                  <td className="px-6 py-4 text-xl text-[var(--color-primary)]">${totalSpent.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
// BudgetPage.jsx