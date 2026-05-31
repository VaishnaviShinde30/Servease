import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { LogOut, Home, User, Hexagon, Moon, Sun, Compass, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem('language', e.target.value);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/20 dark:border-slate-700/50 shadow-sm"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-primary-600 text-white p-2 rounded-xl shadow-md group-hover:scale-105 transition-all duration-300">
              <Compass className="h-6 w-6 stroke-2" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[22px] font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                Servease
              </span>
              <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-1">
                {t('navbar.subtitle') || 'We Recommend, You Decide'}
              </span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-2 py-1.5 border border-slate-200 dark:border-slate-700">
              <Globe className="w-4 h-4 text-slate-500 mr-1" />
              <select 
                value={i18n.language} 
                onChange={changeLanguage}
                className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>

            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }} 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {user ? (
              <>
                <Link to="/profile" className="hidden sm:flex items-center space-x-3 bg-white/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 px-4 py-2 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-400 p-1.5 rounded-full">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200 text-sm hover:text-primary-600 dark:hover:text-primary-400">{user.email.split('@')[0]}</span>
                  <span className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm">
                    {role || 'user'}
                  </span>
                </Link>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-red-100 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('Logout')}</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors">{t('Login')}</Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/signup" className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all border border-primary-500/50">
                    {t('navbar.sign_up') || 'Sign Up'}
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
