import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, User, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

export function Layout({ children, user, onLogout }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB] text-[#2D241E] font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#FDFCFB]/80 backdrop-blur-md border-b border-[#2D241E]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-[#2D241E] flex items-center justify-center rounded-lg group-hover:bg-[#4A3D33] transition-colors">
                <Book className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight">eNovel</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium hover:text-[#B58E72] transition-colors">Home</Link>
              <Link to="/novels" className="text-sm font-medium hover:text-[#B58E72] transition-colors">Gallery</Link>
              <Link to="/about" className="text-sm font-medium hover:text-[#B58E72] transition-colors">About</Link>
              <Link to="/contact" className="text-sm font-medium hover:text-[#B58E72] transition-colors">Contact</Link>
              {user ? (
                <div className="flex items-center gap-6">
                  <Link to="/dashboard" className="text-sm font-medium hover:text-[#B58E72] transition-colors">My Collection</Link>
                  <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 text-sm font-medium hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                  <div className="flex items-center gap-2 bg-[#2D241E]/5 px-3 py-1.5 rounded-full">
                    <User className="w-4 h-4 text-[#B58E72]" />
                    <span className="text-xs font-semibold">{user.email.split('@')[0]}</span>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/auth"
                  className="bg-[#2D241E] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#4A3D33] transition-all transform hover:scale-105"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white border-b border-[#2D241E]/10 px-4 py-8 flex flex-col gap-6 shadow-xl"
            >
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Home</Link>
              <Link to="/novels" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Gallery</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">About</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Contact</Link>
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">My Collection</Link>
                  <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="text-left text-lg font-medium text-red-500">Logout</button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-[#B58E72]">Sign In</Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#2D241E] text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <Book className="text-[#B58E72] w-8 h-8" />
                <span className="text-3xl font-serif font-bold tracking-tight">eNovel</span>
              </Link>
              <p className="text-white/60 max-w-sm leading-relaxed mb-8">
                The world's premium destination for independent authors and novel enthusiasts. 
                Experience literature like never before.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-widest text-[#B58E72] mb-6">Explore</h4>
              <ul className="space-y-4 text-white/70">
                <li><Link to="/" className="hover:text-white transition-colors">Latest Novels</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Partnerships</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-widest text-[#B58E72] mb-6">Support</h4>
              <ul className="space-y-4 text-white/70">
                <li><Link to="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/auth" className="hover:text-white transition-colors">Member Access</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-xs">
            <p>© {new Date().getFullYear()} eNovel Bookstore. Crafted for Literature.</p>
            <div className="flex gap-8">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
