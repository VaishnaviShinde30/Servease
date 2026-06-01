import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, MapPin, Store, Package, BarChart2, TrendingUp, Users, MessageSquare, Star } from 'lucide-react';
import { DUMMY_SHOPS } from '../data/dummyShops';
import { getFeedbackForShop } from '../utils/feedbackManager';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import HelpSupport from '../components/HelpSupport';

export default function ShopkeeperDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('shops');
  const [feedbacks, setFeedbacks] = useState([]);
  
  const [formData, setFormData] = useState({ id: null, name: '', type: '', price: '', description: '', lat: '', lng: '', address: '', contact: '', openingTime: '', closingTime: '' });

  useEffect(() => {
    fetchMyShops();
  }, [user]);

  const fetchMyShops = async () => {
    try {
      const { data, error } = await supabase.from('shops').select('*').eq('owner_id', user.id);
      if (error) throw error;
      setShops(data && data.length > 0 ? data : []); 
    } catch (error) {
      console.error('Error fetching shops:', error);
      const localShops = JSON.parse(localStorage.getItem('demo_shops') || '[]');
      setShops(localShops.filter(s => s.owner_id === user.id)); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'feedback' && shops.length > 0) {
      const allMyFeedback = [];
      shops.forEach(shop => {
        const shopFeedback = getFeedbackForShop(shop.id);
        allMyFeedback.push(...shopFeedback.map(fb => ({...fb, shopName: shop.name})));
      });
      // Sort by newest first
      allMyFeedback.sort((a, b) => new Date(b.date) - new Date(a.date));
      setFeedbacks(allMyFeedback);
    }
  }, [activeTab, shops]);

  const handleSaveShop = async (e) => {
    e.preventDefault();
    
    toast.loading('Saving shop...', { id: 'saveShop' });
    
    let finalLat = formData.lat ? parseFloat(formData.lat) : 18.5204 + (Math.random() * 0.1 - 0.05); // Default random around Pune
    let finalLng = formData.lng ? parseFloat(formData.lng) : 73.8567 + (Math.random() * 0.1 - 0.05);

    if (formData.address && !formData.lat && !formData.lng) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address + ', Pune')}`);
        const data = await res.json();
        if (data && data.length > 0) {
          finalLat = parseFloat(data[0].lat);
          finalLng = parseFloat(data[0].lon);
        }
      } catch (err) {
        console.error("Geocoding failed", err);
      }
    }

    try {
      const payload = {
        owner_id: user.id,
        name: formData.name,
        type: formData.type,
        price: Number(formData.price),
        description: formData.description,
        address: formData.address,
        contact: formData.contact || '',
        openingTime: formData.openingTime || '',
        closingTime: formData.closingTime || '',
        lat: finalLat,
        lng: finalLng,
        rating: formData.id ? undefined : 0, 
      };

      if (formData.id) {
        await supabase.from('shops').update(payload).eq('id', formData.id);
        setShops(shops.map(s => s.id === formData.id ? { ...s, ...payload } : s));
        toast.success('Shop updated successfully!');
      } else {
        const { data, error } = await supabase.from('shops').insert([payload]).select();
        if (error) throw error;
        if (data) setShops([...shops, data[0]]);
        else setShops([...shops, { id: Date.now().toString(), ...payload, rating: 0 }]);
        toast.success('New shop added successfully!', { id: 'saveShop' });
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.success('Demo Mode: Shop saved locally!', { id: 'saveShop' });
      const payload = { 
        id: formData.id || Date.now().toString(), 
        ...formData, 
        owner_id: user.id,
        price: Number(formData.price) || 0,
        contact: formData.contact || '',
        openingTime: formData.openingTime || '',
        closingTime: formData.closingTime || '',
        lat: finalLat,
        lng: finalLng,
        rating: formData.id ? 4.0 : 0 
      };
      let updatedShops;
      if (formData.id) {
        updatedShops = shops.map(s => s.id === formData.id ? payload : s);
      } else {
        updatedShops = [...shops, payload];
      }
      setShops(updatedShops);
      
      // Sync to localStorage for User module
      const localShops = JSON.parse(localStorage.getItem('demo_shops') || '[]');
      if (formData.id) {
        localStorage.setItem('demo_shops', JSON.stringify(localShops.map(s => s.id === formData.id ? payload : s)));
      } else {
        localStorage.setItem('demo_shops', JSON.stringify([...localShops, payload]));
      }
      
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shop?')) return;
    try {
      await supabase.from('shops').delete().eq('id', id);
      setShops(shops.filter(s => s.id !== id));
      toast.success('Shop deleted.');
    } catch (error) {
      toast.success('Demo Mode: Shop deleted.');
      setShops(shops.filter(s => s.id !== id));
    }
  };

  const openModal = (shop = null) => {
    if (shop) {
      setFormData(shop);
    } else {
      setFormData({ id: null, name: '', type: '', price: '', description: '', lat: '', lng: '', address: '', contact: '', openingTime: '', closingTime: '' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-center tracking-tight">
            <Store className="w-8 h-8 text-secondary-500 mr-3" /> {t('My Shops')}
          </h1>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('Shopkeeper Dashboard')}</h1>
          <p className="text-slate-500 font-medium mt-1">{t('Manage your service listings and business profile.')}</p>
        </div>
        <button 
          onClick={() => { setFormData({ id: null, name: '', type: '', price: '', description: '', lat: '', lng: '', address: '', contact: '', openingTime: '', closingTime: '' }); setIsModalOpen(true); }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" /> {t('Add New Shop')}
        </button>
      </div>

      <div className="flex space-x-2 mb-8 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('shops')}
          className={`flex items-center px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'shops' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <Store className="w-4 h-4 mr-2" /> {t('My Shops')}
        </button>
        <button 
          onClick={() => setActiveTab('insights')}
          className={`flex items-center px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'insights' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <BarChart2 className="w-4 h-4 mr-2" /> {t('Shop Insights')}
        </button>
        <button 
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'feedback' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <MessageSquare className="w-4 h-4 mr-2" /> Customer Feedback
        </button>
      </div>

      {activeTab === 'shops' && (
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1,2,3].map(n => (
              <div key={n} className="flex justify-between items-center p-4 border border-slate-100 dark:border-slate-700 rounded-xl animate-pulse">
                <div className="space-y-3 w-1/2">
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded-md w-3/4"></div>
                </div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md w-24"></div>
              </div>
            ))}
          </div>
        ) : shops.length > 0 ? (
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 text-sm border-b-2 border-slate-100 dark:border-slate-700">
                  <th className="p-4 font-bold uppercase tracking-wider">Shop Info</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Service Type</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Base Price</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {shops.map((shop, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }}
                      key={shop.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-extrabold text-slate-800 dark:text-white text-lg group-hover:text-secondary-600 transition-colors">{shop.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs truncate">{shop.description}</div>
                        <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
                          <MapPin className="w-3 h-3 mr-1" /> {shop.address}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider">{shop.type}</span>
                      </td>
                      <td className="p-4 font-extrabold text-slate-800 dark:text-white text-lg">
                        ₹{shop.price}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openModal(shop)} className="p-3 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-xl transition-colors">
                            <Edit2 className="w-5 h-5" />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(shop.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-slate-200 dark:border-slate-800 h-64">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{t('No shops listed')}</h3>
                <p className="text-slate-500 text-sm max-w-xs">You haven't listed any services yet. Click the button above to add your first shop.</p>
              </div>
        )}
      </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 dark:text-slate-300">Total Views</h3>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl"><Users className="w-5 h-5" /></div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{shops.length > 0 ? (shops.length * 142) : 0}</p>
            <p className="text-sm text-emerald-500 font-bold mt-2 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +14% this week</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 dark:text-slate-300">Search Appearances</h3>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-xl"><BarChart2 className="w-5 h-5" /></div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{shops.length > 0 ? (shops.length * 853) : 0}</p>
            <p className="text-sm text-emerald-500 font-bold mt-2 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +22% this week</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 dark:text-slate-300">Avg. Shop Rating</h3>
              <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl"><Store className="w-5 h-5" /></div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {shops.length > 0 ? (shops.reduce((acc, s) => acc + (s.rating || 0), 0) / shops.length).toFixed(1) : '0.0'}
            </p>
            <p className="text-sm text-slate-500 font-bold mt-2 text-center sm:text-left">Based on {shops.reduce((acc, s) => acc + (s.reviewCount || 0), 0)} total reviews</p>
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800">
              <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No feedback yet</h3>
              <p className="text-slate-500">When customers review your shops, they will appear here.</p>
            </div>
          ) : (
            feedbacks.map(fb => (
              <div key={fb.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-lg">{fb.userName}</h4>
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-md mt-1 inline-block">
                      {fb.shopName}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-amber-500 font-bold bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 fill-amber-500 mr-1" /> {fb.rating}
                    </div>
                    <div className="text-xs text-slate-400 mt-2">{new Date(fb.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic">"{fb.comment}"</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-0 w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                    <Store className="w-5 h-5 mr-2 text-primary-500" />
                    {formData.id ? t('Edit') : t('Add New Shop')}
                  </h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              <form onSubmit={handleSaveShop} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Shop Name</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-4 focus:ring-secondary-500/20 focus:border-secondary-500 outline-none transition-all shadow-sm font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Service Type')}</label>
                      <select 
                        required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}
                      >
                        <option value="">Select Type</option>
                        {['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting', 'Mechanic', 'Tailoring', 'Printing', 'Other'].map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Base Price')} (₹)</label>
                      <input required type="number" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-4 focus:ring-secondary-500/20 focus:border-secondary-500 outline-none transition-all shadow-sm font-medium" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Latitude (Optional)</label>
                    <input type="number" step="any" placeholder="e.g. 18.5204" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-4 focus:ring-secondary-500/20 focus:border-secondary-500 outline-none transition-all shadow-sm font-medium" value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('shop.longitude') || 'Longitude (Optional)'}</label>
                    <input type="number" step="any" placeholder="e.g. 73.8567" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-4 focus:ring-secondary-500/20 focus:border-secondary-500 outline-none transition-all shadow-sm font-medium" value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('shop.contact') || 'Contact Number'}</label>
                    <input required type="tel" placeholder="e.g. 9876543210" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-4 focus:ring-secondary-500/20 focus:border-secondary-500 outline-none transition-all shadow-sm font-medium" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('shop.location') || 'Location / Address'}</label>
                    <input required type="text" placeholder="e.g. MG Road, Pune" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-4 focus:ring-secondary-500/20 focus:border-secondary-500 outline-none transition-all shadow-sm font-medium" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('shop.opening_time') || 'Opening Time'}</label>
                    <input type="time" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-4 focus:ring-secondary-500/20 focus:border-secondary-500 outline-none transition-all shadow-sm font-medium" value={formData.openingTime} onChange={e => setFormData({...formData, openingTime: e.target.value})} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('shop.closing_time') || 'Closing Time'}</label>
                    <input type="time" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-4 focus:ring-secondary-500/20 focus:border-secondary-500 outline-none transition-all shadow-sm font-medium" value={formData.closingTime} onChange={e => setFormData({...formData, closingTime: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('shop.description') || 'Description'}</label>
                  <textarea required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-4 focus:ring-secondary-500/20 focus:border-secondary-500 outline-none transition-all shadow-sm h-28 resize-none font-medium" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      {t('Cancel')}
                    </button>
                    <button type="submit" className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all">
                      {t('Save')}
                    </button>
                  </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <HelpSupport />
    </div>
  );
}
