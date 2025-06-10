import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';

// Import context providers directly (they're lightweight)
import { ProductProvider } from './components/ec/contexts/ProductContext';
import { UserProvider } from './contexts/UserContext';
import { OrderProvider } from './contexts/OrderContext';

// Import themes directly to avoid loading issues
import forgotPasswordTheme from './components/forgotPassword/theme/theme';
import theme from './theme/theme';

import "./index.css";

// Lazy load components to improve initial load time
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AuthPage = lazy(() => import("./pages/Register"));
const Homepage = lazy(() => import("./pages/HP"));
const ProfilePage = lazy(() => import("./pages/pf"));
const MessagePage = lazy(() => import("./pages/MessagePage"));

// E-commerce components (lazy loaded)
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));
const ArtisanOrdersPage = lazy(() => import('./pages/ArtisanOrdersPage'));

// Other components
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

// Admin page (should be moved to pages folder eventually)
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

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

// Optimized E-commerce Layout
const EcommerceLayout = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ProductProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Header />
          {children}
        </Suspense>
    </ProductProvider>
  </ThemeProvider>
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <OrderProvider>
            <Router>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Core Routes - Load immediately */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/register" element={<AuthPage />} />
                  
                  {/* Secondary Routes - Lazy loaded */}
                  <Route path="/home" element={<Homepage />} />
                  <Route path="/profile/:userId" element={<ProfilePage />} />
                  <Route path="/message" element={<MessagePage />} />
                  {/* E-commerce Routes - Only load when accessed */}
                  {/* 
                  <Route path="/shop" element={
                    <ProductProvider>
                      <ProductsPage />
                    </ProductProvider>
                  } />
                  <Route path="/shop/product/:id" element={
                    <ProductProvider>
                      <ProductDetailPage />
                    </ProductProvider>
                  } />
                  <Route path="/cart" element={
                    <ProductProvider>
                      <CartPage />
                    </ProductProvider>
                  } /> */}
                  <Route path="/checkout" element={
                    <ProductProvider>
                      <CheckoutPage />
                    </ProductProvider>
                  } />
                  <Route path="/my-orders" element={<MyOrdersPage />} />
                  <Route path="/artisan-orders" element={<ArtisanOrdersPage />} />
                  
                  {/* Utility Routes - Load on demand */}
                  <Route path="/forgot-password" element={
                    <ForgotPasswordLayout>
                      <ForgotPassword />
                    </ForgotPasswordLayout>
                  } />
                  
                  {/* Admin Routes - Using AdminDashboard from layout folder */}
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </Suspense>
            </Router>
        </OrderProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;