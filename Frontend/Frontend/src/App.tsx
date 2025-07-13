import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { SkillSwapProvider } from '@/contexts/SkillSwapContext';
import { Layout } from '@/components/layout/Layout';
import { useEffect } from 'react';
import { initializeStorage } from '@/lib/storage';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import UserProfilePage from '@/pages/profile/UserProfilePage';
import SwapsPage from '@/pages/swaps/SwapsPage';
import BrowsePage from '@/pages/browse/BrowsePage';
import AdminPage from '@/pages/admin/AdminPage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const App = () => {
  // Initialize local storage on app start
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SkillSwapProvider>
            <TooltipProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/browse" element={<BrowsePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/users/:id" element={<UserProfilePage />} />
                  <Route path="/swaps" element={<SwapsPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Route>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster position="top-center" />
            </TooltipProvider>
          </SkillSwapProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
