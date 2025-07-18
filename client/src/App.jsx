import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';

// Import context providers directly (they're lightweight)
import { UserProvider, useAuth } from './shared/contexts/UserContext';
import { ProtectedRoute, PublicRoute, AdminRoute } from './shared/components/auth/ProtectedRoute';

// Import themes directly to avoid loading issues
import forgotPasswordTheme from './features/auth/theme/theme';
import theme from './shared/theme/theme';

import "./index.css";

// Lazy load components to improve initial load time
const LandingPage = lazy(() => import("./features/landingPage/page/LandingPage"));
const AuthPage = lazy(() => import("./features/auth/pages/Register"));
const Homepage = lazy(() => import("./features/home/pages/HP"));
const ProfilePage = lazy(() => import("./features/profile/pages/pf"));
const MessagePage = lazy(() => import("./features/messaging/pages/MessagePage"));
const ProductPage = lazy(() => import("./features/productPage/productPage"));

// E-commerce components (lazy loaded)
const CheckoutPage = lazy(() => import('./features/orders/pages/CheckoutPage'));
const MyOrdersPage = lazy(() => import('./features/orders/pages/MyOrdersPage'));
const ArtisanOrdersPage = lazy(() => import('./features/orders/pages/ArtisanOrdersPage'));

// Other components
const ForgotPassword = lazy(() => import('./features/auth/pages/ForgotPassword'));

// Admin page
const AdminDashboard = lazy(() => import('./features/admin/pages/AdminDashboard'));

// Simple loading component
const LoadingSpinner = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

// Optimized Forgot Password Layout
const ForgotPasswordLayout = ({ children }) => (
  <ThemeProvider theme={forgotPasswordTheme}>
    <CssBaseline />
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  </ThemeProvider>
);

// Main App Routes Component
const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes - Redirect to home if authenticated */}
        <Route path="/" element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        } />
        
        {/* Protected Routes - Require authentication */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        } />
        <Route path="/profile/:userId" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/product/:id" element={
          <ProtectedRoute>
            <ProductPage />
          </ProtectedRoute>
        } />
        
        
        <Route path="/message" element={
          <ProtectedRoute>
            <MessagePage />
          </ProtectedRoute>
        } />
        
        {/* E-commerce Routes - Protected */}
        <Route path="/checkout" element={
          <ProtectedRoute>
              <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/my-orders" element={
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/artisan-orders" element={
          <ProtectedRoute>
            <ArtisanOrdersPage />
          </ProtectedRoute>
        } />
        
        {/* Utility Routes */}
        <Route path="/forgot-password" element={
          <ForgotPasswordLayout>
            <ForgotPassword />
          </ForgotPasswordLayout>
        } />
        {/*<AdminRoute><AdminDashboard /></AdminRoute>*/}
        {/* Admin Routes - Require admin role */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        
        {/* Catch all route - redirect to home if authenticated, otherwise to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
          <Router>
            <AppRoutes />
          </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
