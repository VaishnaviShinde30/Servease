import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [roleInput, setRoleInput] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signup, user, role, loading: loadingAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && role && !loadingAuth) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'shopkeeper') navigate('/shopkeeper');
      else navigate('/user');
    }
  }, [user, role, navigate, loadingAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!import.meta.env.VITE_SUPABASE_URL) {
      toast.error('Environment variables missing! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.');
      return;
    }
    
    try {
      setLoading(true);
      await signup(email, password, name, roleInput);
      toast.success('Account created successfully!');
    } catch (err) {
      if (err.message && err.message.includes('fetch')) {
        toast.error('Network Error: Please check your Vercel Environment Variables (VITE_SUPABASE_URL)');
      } else {
        toast.error(err.message || 'Failed to create account');
      }
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-10 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('signup.title')}</h2>
        <p className="text-slate-500 mt-2 font-medium">{t('signup.subtitle')}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">{t('signup.full_name')}</label>
          <input 
            type="text" 
            required 
            placeholder="John Doe"
            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all shadow-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">{t('signup.email_address')}</label>
          <input 
            type="email" 
            required 
            placeholder="you@example.com"
            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">{t('Password')}</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              placeholder="••••••••"
              className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        <div className="pt-2">
          <label className="block text-sm font-bold text-slate-700 mb-3">{t('signup.iam')}</label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${roleInput === 'customer' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}>
              <input type="radio" name="role" value="customer" className="sr-only" checked={roleInput === 'customer'} onChange={(e) => setRoleInput(e.target.value)} />
              <span className="font-bold">{t('signup.user')}</span>
            </label>
            <label className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${roleInput === 'shopkeeper' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}>
              <input type="radio" name="role" value="shopkeeper" className="sr-only" checked={roleInput === 'shopkeeper'} onChange={(e) => setRoleInput(e.target.value)} />
              <span className="font-bold">{t('signup.shopkeeper')}</span>
            </label>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          type="submit" 
          className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50 mt-6"
        >
          {loading ? t('signup.creating') : t('navbar.sign_up')}
        </motion.button>
      </form>
      
      <div className="mt-8 text-center text-sm text-slate-500 font-medium">
        {t('signup.have_account')}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold ml-1 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">
          {t('login.sign_in')}
        </Link>
      </div>
    </motion.div>
  );
}
