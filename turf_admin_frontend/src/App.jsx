import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cities from './pages/Cities';
import Venues from './pages/Venues';
import Turfs from './pages/Turfs';
import Slots from './pages/Slots';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="wrapper">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cities" 
            element={
              <ProtectedRoute>
                <Cities onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/venues" 
            element={
              <ProtectedRoute>
                <Venues onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/turfs" 
            element={
              <ProtectedRoute>
                <Turfs onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/slots" 
            element={
              <ProtectedRoute>
                <Slots onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="/admin" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
