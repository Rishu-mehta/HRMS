import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Pages/Signup/Signup';
import Login from './Pages/Login/Login';
import './index.css'

// import Candidates from './components/candidate/Candidates';
import Employees from './components/Employee/Employee';
// import Attendance from './components/attendance/Attendance';
// import Leaves from './components/leaves/Leaves';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Candidates from './Pages/Candidate/Candidate';
import { AuthProvider } from './Authservices/AuthContext';
import ProtectedRoute from './Authservices/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <Router>
        
          <Routes>
            <Route path='/signup' element={<Signup/>}/>
             <Route path="/login" element={<Login />} />

              <Route path="/employees" element={<ProtectedRoute><Layout><Employees /></Layout></ProtectedRoute>} />
              <Route path="/" element={<ProtectedRoute><Layout><Candidates /></Layout></ProtectedRoute>} />
           {/* 
           
            <Route path="/attendance" element={<ProtectedRoute><Layout><Attendance /></Layout></ProtectedRoute>} />
            <Route path="/leaves" element={<ProtectedRoute><Layout><Leaves /></Layout></ProtectedRoute>} />
             <Route path="*" element={<Navigate to="/" replace />} />  */}
          </Routes>
        
      </Router>
      </AuthProvider>
    
  );
}

const Layout = ({ children  }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default App;