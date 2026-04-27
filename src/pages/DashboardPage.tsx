import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, ExternalLink, Save, BookOpen, AlertTriangle } from 'lucide-react';
import { Novel } from '../types';
import { store } from '../lib/store';

export function DashboardPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNovel, setEditingNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    category: 'Fiction',
    description: '',
    image_url: ''
  });

  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  const fetchMyNovels = async () => {
    const { data: { user } } = await store.auth.getUser();
    if (!user) return;

    const { data, error } = await store.novels.getByUser(user.id);
    
    if (!error && data) {
      setNovels(data);
    }
    setLoading(false);
  };

  const filteredNovels = novels.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchMyNovels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const priceVal = parseFloat(formData.price);
    if (isNaN(priceVal)) {
      setError('Please enter a valid numeric price.');
      return;
    }

    const { data: { user } } = await store.auth.getUser();
    if (!user) {
      setError('No authenticated user found.');
      return;
    }

    try {
      if (editingNovel) {
        const { error } = await store.novels.update(editingNovel.id, {
          title: formData.title,
          author: formData.author,
          price: priceVal,
          category: formData.category,
          description: formData.description,
          image_url: formData.image_url
        });
        
        if (error) throw error;
      } else {
        const { error } = await store.novels.insert({
          title: formData.title,
          author: formData.author,
          price: priceVal,
          category: formData.category,
          description: formData.description,
          image_url: formData.image_url,
          user_id: user.id
        });
        
        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingNovel(null);
      setFormData({ title: '', author: '', price: '', category: 'Fiction', description: '', image_url: '' });
      fetchMyNovels();
    } catch (err: any) {
      setError(err.message || 'Failed to save novel.');
    }
  };

  const handleEdit = (novel: Novel) => {
    setError('');
    setEditingNovel(novel);
    setFormData({
      title: novel.title,
      author: novel.author,
      price: novel.price.toString(),
      category: novel.category,
      description: novel.description,
      image_url: novel.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { data: { user } } = await store.auth.getUser();
    if (!user) return;

    try {
      const { error } = await store.novels.delete(id);
      
      if (!error) {
        setDeletingId(null);
        fetchMyNovels();
      } else {
        alert(error.message || 'Failed to delete novel.');
      }
    } catch (err) {
      alert('Connection error. Please try again.');
    }
  };

  const stats = {
    total: novels.length,
    value: novels.reduce((acc, n) => acc + (Number(n.price) || 0), 0),
    categories: new Set(novels.map(n => n.category)).size
  };

  return (
    <div className="bg-[#FDFCFB] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-1 border-t-2 border-[#B58E72]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B58E72]">Archive Control</span>
            </div>
            <h1 className="text-6xl font-serif font-black text-[#2D241E] leading-none mb-2">Dashboard</h1>
            <p className="text-[#2D241E]/40 font-serif italic text-xl">Managing your literary legacy</p>
          </div>
          
          <button 
            onClick={() => {
              setEditingNovel(null);
              setFormData({ title: '', author: '', price: '', category: 'Fiction', description: '', image_url: '' });
              setIsModalOpen(true);
            }}
            className="group flex items-center gap-4 bg-[#1A1513] text-white px-10 py-5 rounded-full font-bold hover:bg-[#B58E72] transition-all transform hover:-translate-y-1 shadow-2xl shadow-black/20"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-xs uppercase tracking-widest font-black">Archive New Edition</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { label: 'Total Volumes', value: stats.total, sub: 'In collection' },
            { label: 'Market Value', value: `$${stats.value.toLocaleString()}`, sub: 'Estimated worth' },
            { label: 'Genres', value: stats.categories, sub: 'Diversified categories' }
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label} 
              className="bg-white border border-[#2D241E]/5 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-black/[0.02] transition-all group"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B58E72] mb-4">{stat.label}</p>
              <h4 className="text-4xl font-serif font-black text-[#2D241E] mb-1 group-hover:scale-110 transition-transform origin-left">{stat.value}</h4>
              <p className="text-xs text-[#2D241E]/40">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#2D241E]/5 pb-6 gap-4">
            <h2 className="text-2xl font-serif font-bold text-[#2D241E]">Current Repository</h2>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <input 
                  type="text"
                  placeholder="Search archive..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#2D241E]/10 rounded-full text-xs focus:ring-1 focus:ring-[#B58E72] outline-none transition-all"
                />
                <BookOpen className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#2D241E]/20" />
              </div>
              <div className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-[#2D241E]/40 whitespace-nowrap">
                {filteredNovels.length} Results
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
               <div className="w-12 h-12 border-4 border-[#B58E72]/10 border-t-[#B58E72] rounded-full animate-spin" />
               <p className="font-serif italic text-[#2D241E]/40">Indexing archive files...</p>
            </div>
          ) : novels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-[#2D241E]/10 rounded-[3rem] bg-[#2D241E]/[0.02]">
              <BookOpen className="w-16 h-16 text-[#2D241E]/10 mb-6" />
              <h3 className="text-2xl font-serif font-bold text-[#2D241E]/30 mb-2">The shelves are empty</h3>
              <p className="text-[#2D241E]/30 font-medium mb-8 text-center max-w-sm">Every great library starts with a single volume. Begin your collection now.</p>
              <button 
                 onClick={() => setIsModalOpen(true)}
                 className="text-[#B58E72] font-black uppercase tracking-widest border-b-2 border-[#B58E72] pb-1 hover:pb-3 transition-all text-xs"
              >
                Add Your Inaugural Book
              </button>
            </div>
          ) : filteredNovels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40">
              <AlertTriangle className="w-12 h-12 text-[#2D241E]/10 mb-4" />
              <p className="text-[#2D241E]/40 font-serif italic text-xl text-center">No editions matching your search were found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredNovels.map((novel, index) => (
                <motion.div 
                  layout
                  key={novel.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white border border-[#2D241E]/5 rounded-[2rem] p-6 flex flex-col md:flex-row gap-8 hover:shadow-[0_20px_50px_rgba(45,36,30,0.05)] transition-all hover:border-[#B58E72]/20 items-center"
                >
                  <div className="w-full md:w-28 aspect-[3/4] rounded-xl overflow-hidden bg-[#F2EFE9] flex-shrink-0 shadow-xl shadow-black/5 group-hover:scale-105 transition-transform duration-500">
                    {novel.image_url ? (
                      <img src={novel.image_url} className="w-full h-full object-cover" alt={novel.title} referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#B58E72]/20">
                        <BookOpen className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow py-2 text-center md:text-left">
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-3">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#B58E72] border border-[#B58E72]/20 px-3 py-1 rounded-full">
                        {novel.category}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#2D241E]/30">
                        Vol. #{novel.id.slice(-4).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-3xl font-serif font-black text-[#2D241E] mb-1 group-hover:text-[#B58E72] transition-colors">{novel.title}</h3>
                    <p className="text-[#B58E72] font-serif italic text-lg mb-4">by {novel.author}</p>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-1 px-8 border-x border-[#2D241E]/5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#2D241E]/30">Price</p>
                    <p className="text-2xl font-serif font-black text-[#2D241E]">${novel.price.toFixed(2)}</p>
                  </div>

                  <div className="flex gap-2">
                    {deletingId === novel.id ? (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 bg-red-50 p-2 rounded-full border border-red-100">
                        <button 
                          onClick={() => handleDelete(novel.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => setDeletingId(null)}
                          className="text-red-500 hover:text-red-700 text-[9px] font-black uppercase tracking-widest px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleEdit(novel)}
                          className="p-4 rounded-2xl bg-[#B58E72]/5 text-[#B58E72] hover:bg-[#B58E72] hover:text-white transition-all transform hover:-translate-y-1"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setDeletingId(novel.id)}
                          className="p-4 rounded-2xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all transform hover:-translate-y-1"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#1A1513]/90 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                {/* Form Side */}
                <div className="flex-grow p-8 lg:p-12 overflow-y-auto border-r border-[#2D241E]/5">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h2 className="text-3xl font-serif font-black text-[#2D241E]">
                        {editingNovel ? 'Refine Edition' : 'New Archive'}
                      </h2>
                      <p className="text-[#2D241E]/40 text-xs font-medium uppercase tracking-[0.2em] mt-1">Edition Management</p>
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-bold flex items-center gap-3"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      {error}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#B58E72]">Title of Work</label>
                        <input 
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="w-full px-6 py-4 bg-[#F9F8F6] rounded-2xl border border-transparent focus:bg-white focus:border-[#B58E72] outline-none transition-all font-serif text-lg text-[#2D241E] placeholder:text-[#2D241E]/20"
                          placeholder="The Midnight Archive"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#B58E72]">Author</label>
                        <input 
                          type="text"
                          value={formData.author}
                          onChange={(e) => setFormData({...formData, author: e.target.value})}
                          className="w-full px-5 py-3.5 bg-[#F9F8F6] rounded-xl border border-transparent focus:bg-white focus:border-[#B58E72] outline-none transition-all font-medium text-sm text-[#2D241E]"
                          placeholder="Eleanor Vance"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#B58E72]">List Price ($)</label>
                        <input 
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="w-full px-5 py-3.5 bg-[#F9F8F6] rounded-xl border border-transparent focus:bg-white focus:border-[#B58E72] outline-none transition-all font-mono text-sm text-[#2D241E]"
                          placeholder="0.00"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#B58E72]">Genre Category</label>
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-5 py-3.5 bg-[#F9F8F6] rounded-xl border border-transparent focus:bg-white focus:border-[#B58E72] outline-none transition-all font-medium text-sm text-[#2D241E] appearance-none"
                        >
                          {['Fiction', 'Non-Fiction', 'Mystery', 'Sci-Fi', 'Romance', 'History', 'Biography'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#B58E72]">Cover Asset URL</label>
                        <input 
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                          className="w-full px-5 py-3.5 bg-[#F9F8F6] rounded-xl border border-transparent focus:bg-white focus:border-[#B58E72] outline-none transition-all font-medium text-sm text-[#2D241E]"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#B58E72]">Synopsis / Narrative</label>
                      <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        className="w-full px-5 py-3.5 bg-[#F9F8F6] rounded-xl border border-transparent focus:bg-white focus:border-[#B58E72] outline-none transition-all font-medium text-sm text-[#2D241E] resize-none leading-relaxed"
                        placeholder="Detail the essence of this edition..."
                        required
                      />
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                      <button 
                        type="submit"
                        className="flex-grow bg-[#1A1513] text-white py-5 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:bg-[#B58E72] transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
                      >
                        {editingNovel ? 'Commit Changes' : 'Publish to Collection'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-8 py-5 rounded-2xl bg-[#F9F8F6] text-[#2D241E]/40 font-black text-[10px] tracking-[0.3em] uppercase hover:bg-gray-100 transition-all"
                      >
                        Dismiss
                      </button>
                    </div>
                  </form>
                </div>

                {/* Preview Side */}
                <div className="hidden lg:flex w-[380px] bg-[#FDFCFB] p-12 flex-col justify-center items-center text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B58E72] mb-12">Edition Preview</p>
                  
                  <div className="w-full aspect-[3/4] rounded-2xl bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden mb-10 ring-1 ring-black/5 transform rotate-3 hover:rotate-0 transition-transform duration-700">
                    {formData.image_url ? (
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-10 bg-gradient-to-br from-[#FDFCFB] to-[#F2EFE9]">
                        <BookOpen className="w-12 h-12 text-[#B58E72]/10 mb-4" />
                        <span className="text-[#B58E72]/20 font-serif italic text-sm">Cover asset pending...</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xl font-serif font-black text-[#2D241E] leading-tight">
                      {formData.title || 'Untitled Work'}
                    </h4>
                    <p className="text-[#B58E72] font-serif italic underline decoration-[#B58E72]/20 underline-offset-4">
                      {formData.author || 'Anonymous'}
                    </p>
                  </div>

                  <div className="mt-auto pt-10 w-full border-t border-[#2D241E]/5">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#2D241E]/30">
                      <span>Category</span>
                      <span className="text-[#B58E72]">{formData.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
