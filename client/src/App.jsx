import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import LoginPhone from './pages/Auth/RegisterPhone.jsx'
import RegisterEmail from './pages/Auth/RegisterEmail.jsx'
import LoginMethod from './pages/Auth/LoginMethod.jsx'
import OtpVerify from './pages/Auth/OtpVerify.jsx'
import Home from './pages/Customer/Home.jsx'
import AppShell from './components/layout/AppShell.jsx'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/phone" element={<LoginPhone />} />
        <Route path="/register/email" element={<RegisterEmail />} />
        <Route path="/login/method" element={<LoginMethod />} />
        <Route path="/login/otp" element={<OtpVerify />} />
        <Route path="/customer/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </AppShell>
  )
}

export default App
