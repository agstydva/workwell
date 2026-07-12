import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TrackerProvider } from './context/TrackerContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import { RefreshCw } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

import ScrollToTop from './components/ScrollToTop';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import WellnessCenter from './pages/WellnessCenter';

// Guard wrapper for Protected Routes
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-10 w-10 text-brand-secondary animate-spin" />
          <p className="text-brand-dark text-sm font-semibold">Memverifikasi Sesi...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <TrackerProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                {/* Public / Landing Routes */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Direct Redirection for Auth pages to single-page Landing Modals */}
                <Route path="/login" element={<Navigate to="/?auth=login" replace />} />
                <Route path="/register" element={<Navigate to="/?auth=register" replace />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/wellness-center" element={<ProtectedRoute><WellnessCenter /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                
                {/* Catch-all Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </TrackerProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
