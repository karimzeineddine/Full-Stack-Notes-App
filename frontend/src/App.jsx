import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Root route for the homepage */}
        <Route path="/" element={<Home />} />  {/* Home will be shown at / */}
        
        {/* Other routes */}
        <Route path="/dashboard" element={<Home />} />  {/* For dashboard */}
        <Route path="/login" element={<Login />} />  {/* Login page */}
        <Route path="/signup" element={<SignUp />} />  {/* Signup page */}
      </Routes>
    </Router>
  );
};

export default App;