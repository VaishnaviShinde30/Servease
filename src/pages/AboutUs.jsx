import { Shield, Zap, Target, Users, MapPin, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function AboutUs() {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-3xl shadow-inner mb-4"
        >
          <Globe className="w-10 h-10" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Servease</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Bridging the gap between skilled local professionals and the communities that need them. We make finding trusted neighborhood services simple, transparent, and completely hassle-free.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            To empower local economies by connecting consumers with top-rated, nearby service providers through a smart, transparent, and user-centric platform.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            To become the daily companion for local communities, where every neighborhood business has the opportunity to thrive digitally and every resident finds help instantly.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="text-center space-y-12 bg-slate-50 dark:bg-slate-900/50 p-12 rounded-[3rem]">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">What Drives Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="mx-auto bg-white dark:bg-slate-800 shadow-sm w-16 h-16 rounded-full flex items-center justify-center text-primary-500">
              <Shield className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200">Trust & Transparency</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Genuine reviews and clear pricing. No hidden fees or fake ratings.</p>
          </div>
          <div className="space-y-4">
            <div className="mx-auto bg-white dark:bg-slate-800 shadow-sm w-16 h-16 rounded-full flex items-center justify-center text-primary-500">
              <Zap className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200">Smart Algorithms</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Intelligent recommendations based on distance, price, and overall rating.</p>
          </div>
          <div className="space-y-4">
            <div className="mx-auto bg-white dark:bg-slate-800 shadow-sm w-16 h-16 rounded-full flex items-center justify-center text-primary-500">
              <MapPin className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200">Local First</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Prioritizing the businesses in your immediate neighborhood to build stronger communities.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
