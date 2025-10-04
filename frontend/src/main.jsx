import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import { AuthProvider } from './contexts/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NewLeads from './pages/NewLeads.jsx';
import ExistingLeads from './pages/ExistingLeads.jsx';
import ProjectDeadline from './pages/ProjectDeadline.jsx';
import Budget from './pages/Budget.jsx';
import Payslips from './pages/Payslips.jsx';

function ProtectedLayout() {
  // Header only on protected pages
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="new-leads" element={<NewLeads />} />
        <Route path="existing-leads" element={<ExistingLeads />} />
        <Route path="project-deadline" element={<ProjectDeadline />} />
        <Route path="budget" element={<Budget />} />
        <Route path="payslips" element={<Payslips />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/*" element={<ProtectedLayout />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
