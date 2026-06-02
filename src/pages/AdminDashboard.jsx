import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Trash2, Users, Store, Shield, Activity, Download, Eye, X, AlertTriangle, Ban, CheckCircle, TrendingUp, MessageSquare, Star } from 'lucide-react';
import { DUMMY_REPORTS } from '../data/dummyReports';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DUMMY_SHOPS } from '../data/dummyShops';
import { getFeedback } from '../utils/feedbackManager';
import { getReports, resolveReport } from '../utils/reportManager';
import { SERVICE_CATEGORIES } from '../utils/categories';

const DUMMY_USERS = [
  { id: 'usr-1', name: 'John Doe', email: 'john@example.com', role: 'customer', suspended: false },
  { id: 'usr-2', name: 'Jane Smith', email: 'jane@example.com', role: 'shopkeeper', suspended: false },
  { id: 'usr-3', name: 'Admin', email: 'admin@servease.com', role: 'admin', suspended: false },
  { id: 'usr-4', name: 'Bob Wilson', email: 'bob@example.com', role: 'customer', suspended: true }
];

const userGrowthData = [
  { name: 'Jan', users: 400, left: 24 },
  { name: 'Feb', users: 600, left: 13 },
  { name: 'Mar', users: 850, left: 43 },
  { name: 'Apr', users: 1100, left: 21 },
  { name: 'May', users: 1500, left: 35 },
  { name: 'Jun', users: 2100, left: 18 },
];

const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#14B8A6', '#F43F5E', '#8B5CF6', '#EAB308'];
export default function AdminDashboard() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [reports, setReports] = useState([]);
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddShopOpen, setIsAddShopOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'customer' });
  const [newShop, setNewShop] = useState({ name: '', type: SERVICE_CATEGORIES[0], contact: '', owner_id: 'admin-created' });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'feedback') {
      const fb = getFeedback();
      const sortedFb = fb.sort((a, b) => new Date(b.date) - new Date(a.date));
      // Try to attach shop names dynamically if possible
      const enrichedFb = sortedFb.map(f => {
        const matchingShop = shops.find(s => s.id === f.shopId);
        return { ...f, shopName: matchingShop ? matchingShop.name : f.shopId };
      });
      setAllFeedbacks(enrichedFb);
    }
  }, [activeTab, shops]);

  const fetchData = async () => {
    try {
      let dbUsers = [];
      let dbShops = [];
      try {
        const { data: userData, error: userError } = await supabase.from('users').select('*');
        if (userError) throw userError;
        dbUsers = userData || [];
      } catch (err) {
        console.error('Error fetching admin users:', err);
      }
      
      try {
        const { data: shopData, error: shopError } = await supabase.from('shops').select('*');
        if (shopError) throw shopError;
        dbShops = shopData || [];
      } catch (err) {
        console.error('Error fetching admin shops:', err);
      }

      const localUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
      const localShops = JSON.parse(localStorage.getItem('demo_shops') || '[]');
      
      const mergedUsers = [...DUMMY_USERS, ...localUsers, ...dbUsers];
      const mergedShops = [...DUMMY_SHOPS, ...localShops, ...dbShops];

      // Filter out duplicates by email/id
      const uniqueUsers = Array.from(new Map(mergedUsers.map(u => [u.email || u.id, u])).values());
      const uniqueShops = Array.from(new Map(mergedShops.map(s => [s.id, s])).values());
      
      const deletedUsers = JSON.parse(localStorage.getItem('deleted_users') || '[]');
      const finalUsers = uniqueUsers.filter(u => !deletedUsers.includes(u.id));

      const deletedShops = JSON.parse(localStorage.getItem('deleted_shops') || '[]');
      const finalShops = uniqueShops.filter(s => !deletedShops.includes(s.id));

      setUsers(finalUsers);
      setShops(finalShops);
    } finally {
      setReports(getReports());
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user? This action is permanent.')) return;
    try {
      await supabase.from('users').delete().eq('id', id);
      const newUsers = users.filter(u => u.id !== id);
      setUsers(newUsers);
      localStorage.setItem('demo_users', JSON.stringify(newUsers));
      toast.success('User permanently deleted');
    } catch (error) {
      toast.success('Demo Mode: User deleted locally');
      const newUsers = users.filter(u => u.id !== id);
      setUsers(newUsers);
      localStorage.setItem('demo_users', JSON.stringify(newUsers));
      const deleted = JSON.parse(localStorage.getItem('deleted_users') || '[]');
      deleted.push(id);
      localStorage.setItem('deleted_users', JSON.stringify(deleted));
    }
  };

  const handleDeleteShop = async (id) => {
    if (!window.confirm('Delete this shop?')) return;
    try {
      await supabase.from('shops').delete().eq('id', id);
      const newShops = shops.filter(s => s.id !== id);
      setShops(newShops);
      localStorage.setItem('demo_shops', JSON.stringify(newShops));
      toast.success('Shop permanently removed');
    } catch (error) {
      toast.success('Demo Mode: Shop deleted locally');
      const newShops = shops.filter(s => s.id !== id);
      setShops(newShops);
      localStorage.setItem('demo_shops', JSON.stringify(newShops));
      const deleted = JSON.parse(localStorage.getItem('deleted_shops') || '[]');
      deleted.push(id);
      localStorage.setItem('deleted_shops', JSON.stringify(deleted));
    }
  };

  const handleSuspendUser = async (id) => {
    toast.success('User suspended successfully');
    const newUsers = users.map(u => u.id === id ? { ...u, suspended: true } : u);
    setUsers(newUsers);
    localStorage.setItem('demo_users', JSON.stringify(newUsers));
  };

  const handleUnsuspendUser = async (id) => {
    toast.success('User suspension lifted');
    const newUsers = users.map(u => u.id === id ? { ...u, suspended: false } : u);
    setUsers(newUsers);
    localStorage.setItem('demo_users', JSON.stringify(newUsers));
  };

  const handleSuspendShop = async (id) => {
    toast.success('Shop suspended successfully');
    const newShops = shops.map(s => s.id === id ? { ...s, suspended: true } : s);
    setShops(newShops);
    localStorage.setItem('demo_shops', JSON.stringify(newShops));
  };

  const handleUnsuspendShop = async (id) => {
    toast.success('Shop suspension lifted');
    const newShops = shops.map(s => s.id === id ? { ...s, suspended: false } : s);
    setShops(newShops);
    localStorage.setItem('demo_shops', JSON.stringify(newShops));
  };

  const handleResolveReport = (id) => {
    toast.success('Report marked as resolved');
    const updatedReports = resolveReport(id);
    setReports(updatedReports);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if(!newUser.name || !newUser.email) return toast.error('Please fill required fields');
    const userToAdd = {
      ...newUser,
      id: 'usr-' + Math.random().toString(36).substring(7),
      suspended: false
    };
    const newUsers = [userToAdd, ...users];
    setUsers(newUsers);
    localStorage.setItem('demo_users', JSON.stringify(newUsers));
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', role: 'customer' });
    toast.success('User added successfully');
  };

  const handleAddShop = (e) => {
    e.preventDefault();
    if(!newShop.name || !newShop.contact) return toast.error('Please fill required fields');
    const shopToAdd = {
      ...newShop,
      id: 'shop-' + Math.random().toString(36).substring(7),
      suspended: false,
      price: Math.floor(Math.random() * 500) + 100,
      rating: 4.5,
      reviewCount: 0,
      distance: 2.5
    };
    const newShops = [shopToAdd, ...shops];
    setShops(newShops);
    localStorage.setItem('demo_shops', JSON.stringify(newShops));
    setIsAddShopOpen(false);
    setNewShop({ name: '', type: SERVICE_CATEGORIES[0], contact: '', owner_id: 'admin-created' });
    toast.success('Shop added successfully');
  };

  const dynamicShopCategoryData = Object.values(shops.reduce((acc, shop) => {
    const type = shop.type || shop.service_type || 'Other';
    if (!acc[type]) acc[type] = { name: type, count: 0 };
    acc[type].count += 1;
    return acc;
  }, {})).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center tracking-tight">
             <Shield className="w-8 h-8 text-primary-500 mr-3" /> {t('Admin Panel')}
          </h1>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-slate-800 dark:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg hover:bg-slate-900 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          {t('Print Report')}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <div className="bg-white dark:bg-slate-800 px-4 py-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center flex flex-col justify-center transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50">
          <div className="text-3xl font-black text-slate-800 dark:text-white">{users.length}</div>
          <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 flex items-center justify-center"><Users className="w-3 h-3 mr-1" /> {t('admin.total_users')}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 px-4 py-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center flex flex-col justify-center transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50">
          <div className="text-3xl font-black text-slate-800 dark:text-white">{shops.length}</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1 flex items-center justify-center"><Store className="w-3 h-3 mr-1" /> {t('admin.total_shops')}</div>
            </div>
        <div className="bg-white dark:bg-slate-800 px-4 py-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center flex flex-col justify-center transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2"><TrendingUp className="w-4 h-4 text-emerald-500 opacity-50" /></div>
          <div className="text-3xl font-black text-emerald-500">+12</div>
          <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 flex items-center justify-center">{t('admin.new_users')}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 px-4 py-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center flex flex-col justify-center transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2"><TrendingUp className="w-4 h-4 text-primary-500 opacity-50" /></div>
          <div className="text-3xl font-black text-primary-500">+3</div>
          <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 flex items-center justify-center">{t('admin.new_shops')}</div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden print:shadow-none print:border-none">
        <div className="flex p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 print:hidden">
          <button 
            className={`flex-1 py-4 text-center font-bold flex items-center justify-center transition-all rounded-2xl ${activeTab === 'analytics' ? 'text-slate-900 dark:text-white bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            onClick={() => setActiveTab('analytics')}
          >
            <Activity className="w-5 h-5 mr-2" /> {t('Analytics')}
          </button>
          <button 
            className={`flex-1 py-4 text-center font-bold flex items-center justify-center transition-all rounded-2xl ${activeTab === 'users' ? 'text-slate-900 dark:text-white bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            onClick={() => setActiveTab('users')}
          >
            <Users className="w-5 h-5 mr-2" /> {t('admin.manage_users')}
          </button>
          <button 
            className={`flex-1 py-4 text-center font-bold flex items-center justify-center transition-all rounded-2xl ${activeTab === 'shops' ? 'text-slate-900 dark:text-white bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            onClick={() => setActiveTab('shops')}
          >
            <Store className="w-5 h-5 mr-2" /> {t('admin.manage_shops')}
          </button>
          <button 
            className={`flex-1 py-4 text-center font-bold flex items-center justify-center transition-all rounded-2xl ${activeTab === 'reports' ? 'text-slate-900 dark:text-white bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            onClick={() => setActiveTab('reports')}
          >
            <AlertTriangle className="w-5 h-5 mr-2" /> {t('admin.reports')}
            {reports.filter(r => r.status === 'pending').length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {reports.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
          <button 
            className={`flex-1 py-4 text-center font-bold flex items-center justify-center transition-all rounded-2xl ${activeTab === 'feedback' ? 'text-slate-900 dark:text-white bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            onClick={() => setActiveTab('feedback')}
          >
            <MessageSquare className="w-5 h-5 mr-2" /> {t('admin.global_feedback')}
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="space-y-4 p-4">
              {[1,2,3,4].map(n => (
                <div key={n} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : activeTab === 'analytics' ? (
            <div className="p-4 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Line Chart: Users Came and Went */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-primary-500" />
                    {t('Users Growth (Joined vs Left)')}
                  </h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userGrowthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#0f172a', backgroundColor: '#ffffff' }}
                          cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                        />
                        <Line type="monotone" dataKey="users" name="Users Joined" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="left" name="Users Left" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bar Chart: Shop Categories */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                    <Store className="w-5 h-5 mr-2 text-primary-500" />
                    {t('Shops by Category')}
                  </h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dynamicShopCategoryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#0f172a', backgroundColor: '#ffffff' }}
                        />
                        <Bar dataKey="count" name="Total Shops" radius={[6, 6, 0, 0]}>
                          {dynamicShopCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'users' ? (
            <div className="overflow-x-auto">
              <div className="flex justify-between items-center p-4">
                <h3 className="font-bold text-slate-700 dark:text-slate-200">{t('admin.manage_users')}</h3>
                <button onClick={() => setIsAddUserOpen(true)} className="bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors">{t('admin.add_user')}</button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider border-b-2 border-slate-100 dark:border-slate-800">
                    <th className="p-4 font-bold">{t('admin.user_details')}</th>
                    <th className="p-4 font-bold">{t('admin.role')}</th>
                    <th className="p-4 font-bold text-right">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  <AnimatePresence>
                    {users.map((u, i) => (
                      <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <div className="font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                            {u.name || t('admin.anonymous_user')}
                            {u.suspended && <span className="bg-red-100 text-red-600 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">{t('Suspended')}</span>}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{u.email}</div>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider ${
                            u.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            u.role === 'shopkeeper' ? 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <motion.button title="View Details" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedUser(u)} className="p-3 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors">
                            <Eye className="w-5 h-5" />
                          </motion.button>
                          {u.role !== 'admin' && (
                            <>
                              {u.suspended ? (
                                <motion.button title="Unsuspend" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleUnsuspendUser(u.id)} className="p-3 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors">
                                  <CheckCircle className="w-5 h-5" />
                                </motion.button>
                              ) : (
                                <motion.button title="Suspend" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleSuspendUser(u.id)} className="p-3 text-amber-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-colors">
                                  <Ban className="w-5 h-5" />
                                </motion.button>
                              )}
                              <motion.button title="Delete" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteUser(u.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                <Trash2 className="w-5 h-5" />
                              </motion.button>
                            </>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                    {users.length === 0 && (
                       <tr><td colSpan="3" className="p-12 text-center text-slate-500 font-medium">{t('admin.no_users_found')}</td></tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : activeTab === 'shops' ? (
            <div className="overflow-x-auto">
              <div className="flex justify-between items-center p-4">
                <h3 className="font-bold text-slate-700 dark:text-slate-200">{t('admin.manage_shops')}</h3>
                <button onClick={() => setIsAddShopOpen(true)} className="bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors">{t('admin.add_shop')}</button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider border-b-2 border-slate-100 dark:border-slate-800">
                    <th className="p-4 font-bold">{t('shop.name')}</th>
                    <th className="p-4 font-bold">{t('admin.type')}</th>
                    <th className="p-4 font-bold">{t('shop.contact')}</th>
                    <th className="p-4 font-bold">{t('admin.owner_id')}</th>
                    <th className="p-4 font-bold text-right">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  <AnimatePresence>
                    {shops.map((s, i) => (
                      <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                          {s.name}
                          {s.suspended && <span className="bg-red-100 text-red-600 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">{t('Suspended')}</span>}
                        </td>
                        <td className="p-4"><span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider">{s.type}</span></td>
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{s.contact || 'N/A'}</td>
                        <td className="p-4 text-sm text-slate-400 font-mono">{s.owner_id.substring(0,8)}...</td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <motion.button title="View Details" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedShop(s)} className="p-3 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors">
                            <Eye className="w-5 h-5" />
                          </motion.button>
                          {s.suspended ? (
                            <motion.button title="Unsuspend" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleUnsuspendShop(s.id)} className="p-3 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors">
                              <CheckCircle className="w-5 h-5" />
                            </motion.button>
                          ) : (
                            <motion.button title="Suspend" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleSuspendShop(s.id)} className="p-3 text-amber-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-colors">
                              <Ban className="w-5 h-5" />
                            </motion.button>
                          )}
                          <motion.button title="Delete" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteShop(s.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                    {shops.length === 0 && (
                       <tr><td colSpan="4" className="p-12 text-center text-slate-500 font-medium">{t('admin.no_shops_found')}</td></tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : activeTab === 'reports' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider border-b-2 border-slate-100 dark:border-slate-800">
                    <th className="p-4 font-bold">{t('admin.report_details')}</th>
                    <th className="p-4 font-bold">{t('admin.target')}</th>
                    <th className="p-4 font-bold">{t('admin.status')}</th>
                    <th className="p-4 font-bold text-right">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  <AnimatePresence>
                    {reports.map((r, i) => (
                      <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-800 dark:text-white mb-1">
                            {r.type.toUpperCase().replace('_', ' ')}
                            <span className="ml-2 text-xs text-slate-400 font-normal">by {r.reporter_name}</span>
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">{r.description}</div>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-bold uppercase block mb-1 text-slate-400">{r.target_type}</span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{r.target_name}</span>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${r.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          {r.status === 'pending' && (
                            <motion.button title="Mark Resolved" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleResolveReport(r.id)} className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 text-xs font-bold rounded-lg transition-colors">
                              {t('Resolve')}
                            </motion.button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                    {reports.length === 0 && (
                       <tr><td colSpan="4" className="p-12 text-center text-slate-500 font-medium">{t('admin.no_reports_found')}</td></tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : activeTab === 'feedback' ? (
            <div className="overflow-x-auto p-4 space-y-4">
              {allFeedbacks.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800">
                  <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{t('admin.no_feedback')}</h3>
                </div>
              ) : (
                allFeedbacks.map(fb => (
                  <div key={fb.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-lg">{fb.userName} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">({fb.userId})</span></h4>
                        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-md mt-1 inline-block">
                          Target: {fb.shopName}
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
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('admin.user_details')}</h2>
                <button onClick={() => setSelectedUser(null)} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">ID</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono text-sm">{selectedUser.id}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Name</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedUser.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Email</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedUser.email}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Role</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium uppercase">{selectedUser.role}</span>
                </div>
                {/* For demo: retrieve extended local profile */}
                {(() => {
                  const extended = JSON.parse(localStorage.getItem('extended_profiles') || '{}')[selectedUser.id];
                  if (!extended) return <div className="text-sm text-slate-500 italic">{t('admin.no_extended_profile')}</div>;
                  return (
                    <>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase">Phone</span>
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{extended.phone || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase">Address</span>
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{extended.address || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase">Bio</span>
                        <span className="text-slate-800 dark:text-slate-200 text-sm">{extended.bio || 'N/A'}</span>
                      </div>
                    </>
                  )
                })()}

                {selectedUser.role === 'shopkeeper' && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="block text-xs font-bold text-primary-500 uppercase mb-2">{t('Owned Shops')}</span>
                    <div className="space-y-2">
                      {shops.filter(s => s.owner_id === selectedUser.id).map(shop => (
                        <div key={shop.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{shop.name}</span>
                          <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-500 uppercase font-bold">{shop.type}</span>
                        </div>
                      ))}
                      {shops.filter(s => s.owner_id === selectedUser.id).length === 0 && (
                        <span className="text-xs text-slate-400 italic">{t('admin.no_shops_registered')}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedShop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('admin.shop_details')}</h2>
                <button onClick={() => setSelectedShop(null)} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Shop Name</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">{selectedShop.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">{t('admin.category')}</span>
                    <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] px-2 py-1 rounded-md font-bold uppercase">{selectedShop.type || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">{t('Base Price')}</span>
                    <span className="text-slate-900 dark:text-white font-black text-lg">₹{selectedShop.price}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">Opening Time</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedShop.opening_time || selectedShop.openingTime || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">Closing Time</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{selectedShop.closing_time || selectedShop.closingTime || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Contact</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedShop.contact || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">Address</span>
                  <span className="text-slate-800 dark:text-slate-200 text-sm">{selectedShop.address || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase">{t('shop.description')}</span>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{selectedShop.description || 'No description provided.'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">{t('admin.rating')}</span>
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3 h-3 mr-1 fill-current" /> {selectedShop.rating ?? 'N/A'} ({selectedShop.reviewCount || 0} reviews)
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">Status</span>
                    {selectedShop.suspended ? (
                      <span className="text-xs text-red-600 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">Suspended</span>
                    ) : (
                      <span className="text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">Active</span>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Owner ID</span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-xs break-all">{selectedShop.owner_id}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddUserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('admin.add_new_user')}</h2>
                <button onClick={() => setIsAddUserOpen(false)} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
              </div>
              <form onSubmit={handleAddUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                  <input type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-slate-800 dark:text-white" placeholder="John Doe" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                  <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-slate-800 dark:text-white" placeholder="john@example.com" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                  <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-slate-800 dark:text-white">
                    <option value="customer">{t('admin.customer')}</option>
                    <option value="shopkeeper">{t('admin.shopkeeper')}</option>
                    <option value="admin">{t('admin.admin')}</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-primary-500 text-white font-bold rounded-xl py-3 mt-4 hover:bg-primary-600 transition-colors">Add User</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Shop Modal */}
      <AnimatePresence>
        {isAddShopOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('admin.add_shop')}</h2>
                <button onClick={() => setIsAddShopOpen(false)} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
              </div>
              <form onSubmit={handleAddShop} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('shop.name')}</label>
                  <input type="text" value={newShop.name} onChange={e => setNewShop({...newShop, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-slate-800 dark:text-white" placeholder="Plumb Masters" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('admin.category_type')}</label>
                  <select value={newShop.type} onChange={e => setNewShop({...newShop, type: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-slate-800 dark:text-white">
                    {SERVICE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{t(cat) || cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('admin.contact_details')}</label>
                  <input type="text" value={newShop.contact} onChange={e => setNewShop({...newShop, contact: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-slate-800 dark:text-white" placeholder="+91 9876543210" required />
                </div>
                <button type="submit" className="w-full bg-primary-500 text-white font-bold rounded-xl py-3 mt-4 hover:bg-primary-600 transition-colors">Add Shop</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
