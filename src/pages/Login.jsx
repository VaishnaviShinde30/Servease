import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, role, loading: loadingAuth } = useAuth();
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
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Successfully logged in!');
    } catch (err) {
      toast.error(err.message || 'Failed to log in');
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-16 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 mb-6 shadow-inner">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('login.welcome') || 'Welcome Back'}</h2>
        <p className="text-slate-500 mt-2 font-medium">{t('login.subtitle') || 'Sign in to Servease to continue'}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">{t('login.email') || 'Email Address'}</label>
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
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-slate-700">{t('Password') || 'Password'}</label>
            <Link to="/forgot-password" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Forgot Password?
            </Link>
          </div>
          <input 
            type="password" 
            required 
            placeholder="••••••••"
            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all shadow-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          type="submit" 
          className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50 mt-6"
        >
          {loading ? (t('login.authenticating') || 'Authenticating...') : (t('login.sign_in') || 'Sign In')}
        </motion.button>
      </form>
      
      <div className="mt-8 text-center text-sm text-slate-500 font-medium">
        {t('login.no_account') || "Don't have an account?"}
        <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-bold ml-1 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-primary-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">
          {t('navbar.sign_up') || 'Sign Up'}
        </Link>
      </div>
    </motion.div>
  );
}
