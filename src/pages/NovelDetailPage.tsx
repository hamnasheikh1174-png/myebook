import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Share2, Heart, ArrowLeft, ShieldCheck, Truck, RotateCcw, Trash2 } from 'lucide-react';
import { Novel, User } from '../types';
import { store } from '../lib/store';

interface NovelDetailPageProps {
  user: any;
}

export function NovelDetailPage({ user }: NovelDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNovel() {
      if (!id) return;
      const { data, error } = await store.novels.getById(id);
      
      if (!error && data) {
        setNovel(data);
      }
      setLoading(false);
    }
    fetchNovel();
  }, [id]);

  const handleDelete = async () => {
    if (!novel || !confirm('Warning: This will permanently purge this edition from our records. Proceed?')) return;
    
    try {
      const { error } = await store.novels.delete(novel.id);

      if (!error) {
        navigate('/dashboard');
      } else {
        alert(error.message || 'The archive could not be modified. Please verify your permissions.');
      }
    } catch (err) {
      alert('Network transmission failed. Please try again.');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
      <div className="w-12 h-12 border-4 border-[#B58E72]/10 border-t-[#B58E72] rounded-full animate-spin" />
    </div>
  );

  if (!novel) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFB] gap-8">
      <h1 className="text-4xl font-serif font-black text-[#2D241E]">Archive Not Found</h1>
      <Link to="/" className="text-[#B58E72] font-bold border-b-2 border-[#B58E72]">Return to Gallery</Link>
    </div>
  );

  return (
    <div className="bg-[#FDFCFB] pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#2D241E]/40 hover:text-[#B58E72] transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5 bg-gray-100">
               {novel.image_url ? (
                 <img src={novel.image_url} className="w-full h-full object-cover" alt={novel.title} loading="lazy" referrerPolicy="no-referrer" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-[#B58E72]/20 font-serif text-3xl italic p-20 text-center">
                   {novel.title}
                 </div>
               )}
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-xl flex gap-6">
               <button className="p-3 hover:bg-gray-50 rounded-full transition-colors text-[#2D241E]/40 hover:text-red-500"><Heart className="w-6 h-6" /></button>
               <button className="p-3 hover:bg-gray-50 rounded-full transition-colors text-[#2D241E]/40 hover:text-[#B58E72]"><Share2 className="w-6 h-6" /></button>
            </div>
          </motion.div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
               <span className="px-4 py-1 rounded-full bg-[#B58E72] text-white text-[10px] font-bold uppercase tracking-widest leading-none">
                 {novel.category}
               </span>
               <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D241E]/30">
                 Published Ed. 2026
               </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-serif font-black text-[#2D241E] leading-tight mb-4">{novel.title}</h1>
            <p className="text-2xl font-serif italic text-[#B58E72] mb-10">By {novel.author}</p>
            
            {user && user.id === novel.user_id && (
              <div className="mb-8">
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-[10px] hover:bg-red-50 px-4 py-2 rounded-full border border-red-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove from Archive
                </button>
              </div>
            )}

            <div className="flex items-center gap-8 mb-12 py-8 border-y border-[#2D241E]/5">
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#2D241E]/40 mb-1">Premium Edition</p>
                  <p className="text-5xl font-serif font-black text-[#2D241E]">${novel.price.toFixed(2)}</p>
               </div>
               <div className="h-10 w-px bg-[#2D241E]/10" />
               <div className="flex gap-2">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className="w-2 h-2 rounded-full bg-[#B58E72]" />
                 ))}
                 <span className="text-xs font-bold text-[#2D241E]/40 ml-2">Collector's Grade</span>
               </div>
            </div>

            <div className="space-y-6 mb-12">
               <h3 className="text-sm font-bold uppercase tracking-widest text-[#2D241E]">The Narrative</h3>
               <p className="text-[#2D241E]/70 text-lg leading-relaxed font-light">
                 {novel.description}
               </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mb-12">
               {[
                 { icon: <ShieldCheck className="w-5 h-5" />, title: 'Authentic', sub: 'Certified Ed.' },
                 { icon: <Truck className="w-5 h-5" />, title: 'Premium', sub: 'Global Ship' },
                 { icon: <RotateCcw className="w-5 h-5" />, title: 'Assurace', sub: '30D Returns' },
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center p-6 border border-[#2D241E]/5 rounded-3xl text-center">
                    <div className="text-[#B58E72] mb-3">{item.icon}</div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#2D241E]">{item.title}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#2D241E]/30 mt-1">{item.sub}</p>
                 </div>
               ))}
            </div>

            <button className="group relative w-full bg-[#1A1513] text-white py-6 rounded-full font-black uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-2xl">
               <div className="absolute inset-0 bg-[#B58E72] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               <span className="relative flex items-center justify-center gap-3">
                 <ShoppingCart className="w-5 h-5" />
                 Acquire Edition
               </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
