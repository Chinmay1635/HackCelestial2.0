import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AthleteProfile from './components/Athlete/AthleteProfile';
import AthleteDashboard from './components/Athlete/AthleteDashboard';
import AthleteAcademies from './components/Athlete/AthleteAcademies';
import AthleteTournaments from './components/Athlete/AthleteTournaments';
import AthleteTraining from './components/Athlete/AthleteTraining';
import CoachDashboard from './components/Coach/CoachDashboard';
import CoachLanding from './components/Coach/CoachLanding';
import MyAthletes from './components/Coach/MyAthletes';
import TrainingPlans from './components/Coach/TrainingPlans';
import AcademyDashboard from './components/Academy/AcademyDashboard';
import AcademyLanding from './components/Academy/AcademyLanding';
import AcademyAthletes from './components/Academy/AcademyAthletes';
import AcademyCoaches from './components/Academy/AcademyCoaches';
import AcademyTournaments from './components/Academy/AcademyTournaments';
import SponsorDashboard from './components/Sponsor/SponsorDashboard';
import SponsorLanding from './components/Sponsor/SponsorLanding';
import DiscoverAthletes from './components/Sponsor/DiscoverAthletes';
import TopPerformers from './components/Sponsor/TopPerformers';
import LandingPage from './components/LandingPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Main App Component
const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Register />} />

        {/* Athlete Routes */}
        <Route 
          path="/athlete/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['athlete']}>
              <AthleteDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/athlete/profile" 
          element={
            <ProtectedRoute allowedRoles={['athlete']}>
              <AthleteProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/athlete/academies" 
          element={
            <ProtectedRoute allowedRoles={['athlete']}>
              <AthleteAcademies />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/athlete/tournaments" 
          element={
            <ProtectedRoute allowedRoles={['athlete']}>
              <AthleteTournaments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/athlete/training" 
          element={
            <ProtectedRoute allowedRoles={['athlete']}>
              <AthleteTraining />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/athlete/landing" 
          element={
            <ProtectedRoute allowedRoles={['athlete']}>
              <AthleteDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Coach Routes */}
        <Route 
          path="/coach/landing" 
          element={
            <ProtectedRoute allowedRoles={['coach']}>
              <CoachLanding />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/coach/athletes" 
          element={
            <ProtectedRoute allowedRoles={['coach']}>
              <MyAthletes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/coach/training-plans" 
          element={
            <ProtectedRoute allowedRoles={['coach']}>
              <TrainingPlans />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/coach/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['coach']}>
              <CoachDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Academy Routes */}
        <Route 
          path="/academy/landing" 
          element={
            <ProtectedRoute allowedRoles={['academy']}>
              <AcademyLanding />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/academy/athletes" 
          element={
            <ProtectedRoute allowedRoles={['academy']}>
              <AcademyAthletes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/academy/coaches" 
          element={
            <ProtectedRoute allowedRoles={['academy']}>
              <AcademyCoaches />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/academy/tournaments" 
          element={
            <ProtectedRoute allowedRoles={['academy']}>
              <AcademyTournaments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/academy/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['academy']}>
              <AcademyDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Sponsor Routes */}
        <Route 
          path="/sponsor/landing" 
          element={
            <ProtectedRoute allowedRoles={['sponsor']}>
              <SponsorLanding />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sponsor/athletes" 
          element={
            <ProtectedRoute allowedRoles={['sponsor']}>
              <DiscoverAthletes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sponsor/discover-athletes" 
          element={
            <ProtectedRoute allowedRoles={['sponsor']}>
              <DiscoverAthletes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sponsor/top-performers" 
          element={
            <ProtectedRoute allowedRoles={['sponsor']}>
              <TopPerformers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sponsor/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['sponsor']}>
              <SponsorDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;