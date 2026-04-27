import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, ChevronRight, Bookmark } from 'lucide-react';
import { Novel } from '../types';
import { store } from '../lib/store';

export function HomePage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNovels() {
      const { data, error } = await store.novels.getAll();
      
      if (!error && data) {
        setNovels(data.slice(0, 8));
      }
      setLoading(false);
    }
    fetchNovels();
  }, []);

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-[#1A1513]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1513] via-[#1A1513]/80 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=2000" 
            alt="Library" 
            className="w-full h-full object-cover grayscale opacity-40 shadow-inner"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#B58E72] text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6 shadow-lg shadow-[#B58E72]/20">
              New Arrival Summer 2026
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-black text-white leading-[0.9] mb-8">
              Curate Your <br />
              <span className="text-[#B58E72]">Soul's Library</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-lg mb-10 font-light italic">
              "A room without books is like a body without a soul." Explore our hand-picked collection of premium novels.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#discover" className="bg-white text-[#1A1513] px-10 py-4 rounded-full font-bold hover:bg-[#B58E72] hover:text-white transition-all transform hover:scale-105 shadow-xl">
                Start Reading
              </a>
              <Link to="/about" className="border border-white/30 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 backdrop-blur-sm transition-all">
                Our Heritage
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Grid */}
      <section id="discover" className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-5xl font-serif font-bold text-[#2D241E] mb-4">Latest Editions</h2>
            <p className="text-[#2D241E]/60 max-w-md">Discover the most sought-after literary works added by our community of authors this week.</p>
          </div>
          <Link to="/novels" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#B58E72] hover:text-[#2D241E] transition-colors">
            View All Collection <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-2xl mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {novels.length === 0 ? (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-[#2D241E]/10 rounded-3xl bg-[#2D241E]/[0.02]">
                <p className="text-[#2D241E]/40 font-serif italic text-xl">Our shelves are currently empty... check back soon!</p>
              </div>
            ) : (
              novels.map((novel, index) => (
                <motion.div 
                  key={novel.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link to={`/novel/${novel.id}`} className="block relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 shadow-2xl shadow-black/5 ring-1 ring-black/5 group-hover:ring-[#B58E72]/50 transition-all">
                    {novel.image_url ? (
                      <img 
                        src={novel.image_url} 
                        alt={novel.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#FDFCFB] to-[#F2EFE9]">
                         <Bookmark className="w-12 h-12 text-[#B58E72]/20 mb-4" />
                         <span className="text-xs font-bold uppercase tracking-widest text-[#B58E72]/40">{novel.category}</span>
                         <h3 className="text-xl font-serif font-bold text-[#2D241E] mt-2">{novel.title}</h3>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                       <span className="text-white text-sm font-bold uppercase tracking-widest underline underline-offset-8">Explore Details</span>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#2D241E] shadow-lg">
                      ${novel.price.toFixed(2)}
                    </div>
                  </Link>
                  <div className="mt-6 flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#2D241E] group-hover:text-[#B58E72] transition-colors">{novel.title}</h3>
                      <p className="text-sm text-[#2D241E]/50 font-medium">By {novel.author}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B58E72] bg-[#B58E72]/10 px-2 py-1 rounded">
                      {novel.category}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Magazine Style Section */}
      <section className="bg-[#1A1513] py-40 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl rotate-[-3deg] relative z-10 ring-8 ring-white/5">
              <img 
                src="https://images.unsplash.com/photo-1491843384429-30494622eb90?auto=format&fit=crop&q=80&w=1000" 
                alt="Reading" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 border-2 border-[#B58E72] rounded-[2rem] translate-x-8 translate-y-8 rotate-3 -z-0" />
            <div className="absolute -bottom-10 -right-10 bg-[#B58E72] text-white p-8 rounded-full w-40 h-40 flex items-center justify-center text-center font-serif font-black leading-none rotate-12 z-20 shadow-2xl">
              <div>
                 <div className="text-4xl">100+</div>
                 <div className="text-[10px] uppercase tracking-widest mt-2">New titles monthly</div>
              </div>
            </div>
          </motion.div>

          <div>
             <h2 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-10">
               Beyond the <br />
               <span className="italic font-light text-[#B58E72]">Written Word.</span>
             </h2>
             <p className="text-xl text-white/50 leading-relaxed mb-12 font-light">
               We believe every book tells two stories: the one inside the pages, and the one it creates in your life. 
               Join our community of collectors and dreamers.
             </p>
             <ul className="space-y-6 mb-16">
               {[
                 'Exclusive First Editions',
                 'Direct Author Interactions',
                 'Global Literary Community',
                 'Secure Collector Management'
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-4 text-white group">
                   <div className="w-6 h-6 rounded-full border border-[#B58E72] flex items-center justify-center group-hover:bg-[#B58E72] transition-colors">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#B58E72] group-hover:bg-white" />
                   </div>
                   <span className="font-semibold tracking-wide">{item}</span>
                 </li>
               ))}
             </ul>
             <Link to="/auth" className="inline-block border-2 border-[#B58E72] text-[#B58E72] px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-[#B58E72] hover:text-white transition-all">
               Join The Inner Circle
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
