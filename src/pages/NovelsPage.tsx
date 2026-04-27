import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, ChevronRight, Bookmark, Filter } from 'lucide-react';
import { Novel } from '../types';

export function NovelsPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('/api/novels')
      .then(res => res.json())
      .then(data => {
        setNovels(data);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...new Set(novels.map(n => n.category))];

  const filteredNovels = novels.filter(novel => {
    const matchesSearch = novel.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         novel.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || novel.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-20">
        <h1 className="text-5xl md:text-7xl font-serif font-black text-[#2D241E] mb-6">The Collective</h1>
        <p className="text-xl text-[#2D241E]/60 max-w-2xl font-light italic">
          Explore our complete archive of literary masterpieces, curated for the modern intellectual.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-8 mb-16 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B58E72]" />
          <input 
            type="text"
            placeholder="Search titles or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-[#2D241E]/[0.02] border border-[#2D241E]/5 rounded-2xl focus:border-[#B58E72]/50 outline-none transition-all font-medium text-[#2D241E]/80"
          />
        </div>

        <div className="flex items-center gap-4 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 scrollbar-hide">
          <Filter className="w-4 h-4 text-[#B58E72] shrink-0" />
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedCategory === category 
                ? 'bg-[#2D241E] text-white shadow-xl shadow-black/10' 
                : 'text-[#2D241E]/40 hover:text-[#B58E72] hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-100 rounded-2xl mb-4" />
              <div className="h-6 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredNovels.length === 0 ? (
              <div className="col-span-full py-40 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <Bookmark className="w-12 h-12 text-[#B58E72]/20 mx-auto mb-4" />
                <p className="text-[#2D241E]/40 font-serif italic text-xl">No editions found matching your criteria.</p>
              </div>
            ) : (
              filteredNovels.map((novel, index) => (
                <motion.div 
                  key={novel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <Link to={`/novel/${novel.id}`} className="block relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 shadow-xl group-hover:shadow-2xl transition-all duration-500 ring-1 ring-black/5 hover:ring-[#B58E72]/30">
                    {novel.imageUrl ? (
                      <img 
                        src={novel.imageUrl} 
                        alt={novel.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#FDFCFB] to-[#F2EFE9]">
                         <Bookmark className="w-8 h-8 text-[#B58E72]/20 mb-3" />
                         <h3 className="text-lg font-serif font-bold text-[#2D241E] leading-tight">{novel.title}</h3>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#2D241E] shadow-sm">
                      ${novel.price.toFixed(2)}
                    </div>
                  </Link>
                  <div className="mt-5">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-serif font-bold text-[#2D241E] group-hover:text-[#B58E72] transition-colors line-clamp-1">{novel.title}</h3>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-[#B58E72] bg-[#B58E72]/5 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                        {novel.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#2D241E]/50 font-medium">By {novel.author}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="mt-32 p-20 bg-[#1A1513] rounded-[3rem] text-center overflow-hidden relative">
             <div className="absolute inset-0 opacity-10 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="absolute border border-white/20 rounded-full animate-pulse" style={{
                    width: Math.random() * 300,
                    height: Math.random() * 300,
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animationDelay: Math.random() * 5 + 's'
                  }} />
                ))}
             </div>
             <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-6">Become a Curator</h2>
                <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto font-light">Join our exclusive network of literary experts and start archiving your own collection today.</p>
                <Link to="/auth" className="inline-block bg-[#B58E72] text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-[#1A1513] transition-all transform hover:scale-105 shadow-2xl">
                  Registry Portal
                </Link>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
