// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. StaffLoginPage: Fix path to use './components/pages/'
import StaffLoginPage from './components/pages/auth/StaffLoginPage';

// 2. StaffSignupPage: Fix path to use './components/pages/'
import StaffSignupPage from './components/pages/auth/StaffSignupPage';
import RenterLoginPage from './components/pages/auth/RenterLoginPage'   // Adjusted Renter name for clarity
import RenterSignupPage from './components/pages/auth/RenterSignupPage'; // Adjusted Renter name for clarity

// Import your Dashboards later
import StaffDashboard from './components/pages/dashboard/StaffDashboard';
import RenterDashboard from './components/pages/renter/RenterDashboard'; 
import FIFOQueuePage from './components/pages/dashboard/FIFOQueuePage';


function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Authentication Routes --- */}
        
        {/* Customer Assistant (Staff) Routes */}
        <Route path="/staff/signup" element={<StaffSignupPage />} />
        <Route path="/staff/login" element={<StaffLoginPage />} />

        {/* Renter/Owner Routes */}
        <Route path="/renter/signup" element={<RenterSignupPage />} />
        <Route path="/renter/login" element={<RenterLoginPage />} />

        {/* Home/Default Route */}
        <Route path="" element={<RenterLoginPage />} /> You might make this a landing page


        {/* --- Protected Routes (To be implemented later with Auth Guards) --- */}
        
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/renter/dashboard" element={<RenterDashboard />} />
        {/* NEW: Dedicated Ticket Queue Page */}
        <Route path="/tickets" element={<FIFOQueuePage />} />
        
       

      </Routes>
    </Router>
  );
}

export default App;
