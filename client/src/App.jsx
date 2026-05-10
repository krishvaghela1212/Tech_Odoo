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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/trips" element={<MyTripsPage />} />
                <Route path="/trips/new" element={<CreateTripPage />} />
                <Route path="/trips/:tripId/builder" element={<ItineraryBuilderPage />} />
                <Route path="/trips/:tripId/view" element={<ItineraryViewPage />} />
                <Route path="/trips/:tripId/cities" element={<CitySearchPage />} />
                <Route path="/trips/:tripId/stops/:stopId/activities" element={<ActivitySearchPage />} />
                <Route path="/trips/:tripId/budget" element={<BudgetPage />} />
                <Route path="/trips/:tripId/checklist" element={<PackingChecklistPage />} />
                <Route path="/trips/:tripId/notes" element={<TripNotesPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
