import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="bg-white dark:bg-raisin-800 p-12 rounded-3xl shadow-xl max-w-lg w-full border border-raisin-100 dark:border-raisin-700"
      >
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <AlertTriangle className="w-12 h-12" />
        </div>
        
        <h1 className="text-6xl font-black text-raisin-900 dark:text-white tracking-tighter mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-raisin-800 dark:text-raisin-200 mb-4">
          {t('notfound.title')}
        </h2>
        
        <p className="text-raisin-500 dark:text-raisin-400 mb-8 leading-relaxed font-medium">
          {t('notfound.desc')}
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center justify-center w-full px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-tranraisin-y-1"
        >
          <Home className="w-5 h-5 mr-2" />
          {t('notfound.back')}
        </Link>
      </motion.div>
    </div>
  );
}
