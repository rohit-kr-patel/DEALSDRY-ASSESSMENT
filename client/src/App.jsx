// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import CreateEmployee from './pages/CreateEmployee';

import Edit from './pages/Edit';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/employees" element={isLoggedIn ? <EmployeeList /> : <Navigate to="/login" />} />
        <Route path="/create-employee" element={isLoggedIn ? <CreateEmployee /> : <Navigate to="/login" />} />
        <Route path='/edit' element={isLoggedIn ? <Edit emp/>:<Navigate to ='/login'/>}/>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;