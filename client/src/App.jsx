import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import MyTripsPage from './pages/MyTripsPage'
import CreateTripPage from './pages/CreateTripPage'
import ItineraryBuilderPage from './pages/ItineraryBuilderPage'
import ItineraryViewPage from './pages/ItineraryViewPage'
import CitySearchPage from './pages/CitySearchPage'
import ActivitySearchPage from './pages/ActivitySearchPage'
import BudgetPage from './pages/BudgetPage'
import PackingChecklistPage from './pages/PackingChecklistPage'
import TripNotesPage from './pages/TripNotesPage'
import ProfilePage from './pages/ProfilePage'
import PublicItineraryPage from './pages/PublicItineraryPage'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[var(--color-bg)]">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/share/:shareToken" element={<PublicItineraryPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<div className="pt-28 md:pt-36"><Dashboard /></div>} />
                <Route path="/trips" element={<div className="pt-28 md:pt-36"><MyTripsPage /></div>} />
                <Route path="/trips/new" element={<CreateTripPage />} />
                <Route path="/trips/:tripId/builder" element={<div className="pt-28 md:pt-36"><ItineraryBuilderPage /></div>} />
                <Route path="/trips/:tripId/view" element={<ItineraryViewPage />} />
                <Route path="/trips/:tripId/cities" element={<div className="pt-28 md:pt-36"><CitySearchPage /></div>} />
                <Route path="/trips/:tripId/stops/:stopId/activities" element={<div className="pt-28 md:pt-36"><ActivitySearchPage /></div>} />
                <Route path="/trips/:tripId/budget" element={<div className="pt-28 md:pt-36"><BudgetPage /></div>} />
                <Route path="/trips/:tripId/checklist" element={<div className="pt-28 md:pt-36"><PackingChecklistPage /></div>} />
                <Route path="/trips/:tripId/notes" element={<div className="pt-28 md:pt-36"><TripNotesPage /></div>} />
                <Route path="/profile" element={<div className="pt-28 md:pt-36"><ProfilePage /></div>} />
                <Route path="/admin" element={<div className="pt-28 md:pt-36"><AdminDashboard /></div>} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
