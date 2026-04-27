/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Book } from 'lucide-react';
import { User } from './types';

// Lazy load pages for better bundle performance
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const NovelDetailPage = lazy(() => import('./pages/NovelDetailPage').then(m => ({ default: m.NovelDetailPage })));
const NovelsPage = lazy(() => import('./pages/NovelsPage').then(m => ({ default: m.NovelsPage })));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
    <div className="w-10 h-10 border-2 border-[#B58E72]/10 border-t-[#B58E72] rounded-full animate-spin" />
    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B58E72]">Loading Archive</span>
  </div>
);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setUser(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (token: string, userId: number) => {
    localStorage.setItem('token', token);
    fetch('/api/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setUser(data));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-[#FDFCFB] flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-[#2D241E] flex items-center justify-center rounded-2xl shadow-2xl animate-pulse">
            <Book className="text-white w-8 h-8" />
          </div>
          <div className="h-1 w-32 bg-[#2D241E]/5 rounded-full overflow-hidden">
             <div className="h-full bg-[#B58E72] animate-progress" />
          </div>
       </div>
    </div>
  );

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/novels" element={<NovelsPage />} />
            <Route path="/novel/:id" element={<NovelDetailPage user={user} />} />
            <Route 
              path="/auth" 
              element={!user ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <DashboardPage /> : <Navigate to="/auth" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

