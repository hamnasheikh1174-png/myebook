import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, ExternalLink, Save, BookOpen, AlertTriangle } from 'lucide-react';
import { Novel } from '../types';

export function DashboardPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNovel, setEditingNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    category: 'Fiction',
    description: '',
    imageUrl: ''
  });

  const [error, setError] = useState('');

  const fetchMyNovels = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/my-novels', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      setNovels(data);
    }
    setLoading(false);
  };

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

    const token = localStorage.getItem('token');
    const url = editingNovel ? `/api/novels/${editingNovel.id}` : '/api/novels';
    const method = editingNovel ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: priceVal
        })
      });

      const data = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        setEditingNovel(null);
        setFormData({ title: '', author: '', price: '', category: 'Fiction', description: '', imageUrl: '' });
        fetchMyNovels();
      } else {
        setError(data.error || 'Failed to save novel.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
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
      imageUrl: novel.imageUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/novels/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setDeletingId(null);
        fetchMyNovels();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete novel.');
      }
    } catch (err) {
      alert('Connection error. Please try again.');
    }
  };

  return (
    <div className="bg-[#FDFCFB] min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h1 className="text-5xl font-serif font-black text-[#2D241E] mb-4">My Collection</h1>
            <p className="text-[#2D241E]/50 font-medium">Manage and curate your world-class library of novels.</p>
          </div>
          <button 
            onClick={() => {
              setEditingNovel(null);
              setFormData({ title: '', author: '', price: '', category: 'Fiction', description: '', imageUrl: '' });
              setIsModalOpen(true);
            }}
            className="group flex items-center gap-3 bg-[#1A1513] text-white px-8 py-4 rounded-full font-bold hover:bg-[#B58E72] transition-all transform hover:scale-105 shadow-xl shadow-black/10"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Add New Novel
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
             <div className="w-12 h-12 border-4 border-[#B58E72]/10 border-t-[#B58E72] rounded-full animate-spin" />
             <p className="font-serif italic text-[#2D241E]/40">Retriving archival data...</p>
          </div>
        ) : novels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-[#2D241E]/10 rounded-[3rem] bg-[#2D241E]/[0.02]">
            <BookOpen className="w-16 h-16 text-[#2D241E]/10 mb-6" />
            <h3 className="text-2xl font-serif font-bold text-[#2D241E]/30 mb-2">Your collection is empty</h3>
            <p className="text-[#2D241E]/30 font-medium mb-8">Start your literary legacy today.</p>
            <button 
               onClick={() => setIsModalOpen(true)}
               className="text-[#B58E72] font-bold border-b-2 border-[#B58E72] hover:pb-2 transition-all"
            >
              Add your first book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {novels.map((novel) => (
              <motion.div 
                layout
                key={novel.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group relative bg-white border border-[#2D241E]/5 rounded-3xl p-6 flex flex-col md:flex-row gap-8 hover:shadow-2xl hover:shadow-black/5 transition-all hover:border-[#B58E72]/20"
              >
                <div className="w-full md:w-32 aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 shadow-lg group-hover:rotate-[-2deg] transition-transform">
                  {novel.imageUrl ? (
                    <img src={novel.imageUrl} className="w-full h-full object-cover" alt={novel.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#2D241E]/5 text-[#2D241E]/20">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow py-2">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B58E72] bg-[#B58E72]/10 px-3 py-1 rounded-full">
                      {novel.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D241E]/40">
                      ID: #{novel.id.toString().padStart(4, '0')}
                    </span>
                  </div>
                  <h3 className="text-3xl font-serif font-black text-[#2D241E] mb-2">{novel.title}</h3>
                  <p className="text-[#B58E72] font-bold mb-4">by {novel.author}</p>
                  <p className="text-[#2D241E]/60 text-sm leading-relaxed max-w-2xl line-clamp-2">
                    {novel.description}
                  </p>
                </div>

                <div className="flex md:flex-col justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-[#2D241E]/5 md:pl-8">
                  <div className="mb-auto hidden md:block">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#2D241E]/40 mb-1">List Price</p>
                    <p className="text-2xl font-serif font-bold text-[#2D241E]">${novel.price.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    {deletingId === novel.id ? (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                        <button 
                          onClick={() => handleDelete(novel.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                        >
                          Confirm Purge
                        </button>
                        <button 
                          onClick={() => setDeletingId(null)}
                          className="text-[#2D241E]/40 hover:text-[#2D241E] text-[10px] font-black uppercase tracking-widest px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleEdit(novel)}
                          className="p-3 rounded-full hover:bg-[#B58E72]/10 text-[#B58E72] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setDeletingId(novel.id)}
                          className="p-3 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
              className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-serif font-black text-[#2D241E]">
                      {editingNovel ? 'Edit Entry' : 'Archive Entry'}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-[#2D241E]/40" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-bold flex items-center gap-3 animate-in">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#B58E72]">Title</label>
                      <input 
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-100 focus:border-[#B58E72] outline-none transition-all font-medium text-xs"
                        placeholder="e.g. The Great Gatsby"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#B58E72]">Author</label>
                      <input 
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-100 focus:border-[#B58E72] outline-none transition-all font-medium text-xs"
                        placeholder="F. Scott Fitzgerald"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#B58E72]">Price ($)</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-100 focus:border-[#B58E72] outline-none transition-all font-medium text-xs"
                        placeholder="29.99"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#B58E72]">Category</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-100 focus:border-[#B58E72] outline-none transition-all font-medium text-xs appearance-none"
                      >
                        {['Fiction', 'Non-Fiction', 'Mystery', 'Sci-Fi', 'Romance', 'History', 'Biography'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#B58E72]">Image URL</label>
                      <input 
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-100 focus:border-[#B58E72] outline-none transition-all font-medium text-xs"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#B58E72]">Brief Narrative</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-100 focus:border-[#B58E72] outline-none transition-all font-medium text-xs resize-none"
                      placeholder="Describe the soul of this work..."
                      required
                    />
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                    <button 
                      type="submit"
                      className="w-full bg-[#1A1513] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#B58E72] transition-all shadow-lg text-[10px] tracking-[0.2em] uppercase"
                    >
                      <Save className="w-4 h-4" />
                      {editingNovel ? 'Commit Update' : 'Publish Edition'}
                    </button>
                    
                    {editingNovel && (
                      <button 
                        type="button"
                        onClick={() => {
                          if (confirm('Permanently purge this edition?')) {
                            setIsModalOpen(false);
                            handleDelete(editingNovel.id);
                          }
                        }}
                        className="w-full bg-red-50 text-red-500 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-all text-[10px] tracking-[0.2em] uppercase"
                      >
                        <Trash2 className="w-4 h-4" />
                        Purge from Archive
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
