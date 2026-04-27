import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, Book, CheckCircle2 } from 'lucide-react';
import { store } from '../lib/store';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await store.auth.signInWithPassword({
          email,
        });
        if (error) throw error;
      } else {
        const { error } = await store.auth.signUp({
          email,
        });
        if (error) throw error;
      }
      window.dispatchEvent(new Event('auth-change'));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] grid lg:grid-cols-2">
      {/* Visual Side */}
      <div className="hidden lg:flex relative bg-[#1A1513] items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
            src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1000" 
            className="w-full h-full object-cover opacity-30 grayscale"
            alt="Books"
           />
           <div className="absolute inset-0 bg-gradient-to-br from-[#B58E72]/20 to-transparent" />
        </div>
        
        <div className="relative z-10 text-white max-w-md">
          <Book className="w-16 h-16 text-[#B58E72] mb-10" />
          <h2 className="text-5xl font-serif font-bold mb-8 leading-tight">Your gateway to infinite worlds.</h2>
          <div className="space-y-6">
            {[
              'Secure encrypted vault for your literary data',
              'Unified dashboard for collection management',
              'Exclusive access to premium community features'
            ].map((text, i) => (
              <div key={i} className="flex gap-4 items-start">
                <CheckCircle2 className="w-6 h-6 text-[#B58E72] shrink-0" />
                <p className="text-white/70 font-medium leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-serif font-black text-[#2D241E] mb-3">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-[#2D241E]/50 font-medium">
              {isLogin ? 'Enter your credentials to access your library.' : 'Join the most elite community of bibliophiles.'}
            </p>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-semibold flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#B58E72] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#B58E72] transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#B58E72]/10 focus:border-[#B58E72] outline-none transition-all font-medium text-[#2D241E]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#B58E72] ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#B58E72] transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#B58E72]/10 focus:border-[#B58E72] outline-none transition-all font-medium text-[#2D241E]"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1A1513] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#3D3530] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-[#1A1513]/10"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In Now' : 'Create My Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[#2D241E]/40 text-sm font-medium">
              {isLogin ? "Don't have an account yet?" : "Already a member?"}
            </p>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="mt-2 text-[#B58E72] font-bold hover:underline underline-offset-4"
            >
              {isLogin ? 'Join Our Community' : 'Access Your Vault'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
