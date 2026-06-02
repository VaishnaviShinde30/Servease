import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, Globe, Moon, Sun, Bell, Shield, LogOut, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    promotional: true
  });

  const [savedMessage, setSavedMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    showSaved(t('settings.language_updated') || 'Language updated');
  };

  const handleToggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    showSaved(t('settings.notif_updated') || 'Notification preferences updated');
  };

  const showSaved = (msg) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-2xl">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('settings.title')}</h1>
            <p className="text-slate-500 dark:text-slate-400">{t('settings.subtitle')}</p>
          </div>
        </div>
        
        {savedMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-xl text-sm font-bold"
          >
            <Check className="w-4 h-4 mr-2" />
            {savedMessage}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="col-span-1 space-y-2">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div 
              onClick={() => setActiveTab('general')}
              className={`flex items-center font-bold p-3 rounded-xl cursor-pointer transition-colors ${activeTab === 'general' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
            >
              <Globe className="w-5 h-5 mr-3" />
              {t('settings.general')}
              {activeTab === 'general' && <ChevronRight className="w-4 h-4 ml-auto" />}
            </div>
            <div 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center font-bold p-3 rounded-xl cursor-pointer transition-colors mt-1 ${activeTab === 'notifications' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
            >
              <Bell className="w-5 h-5 mr-3" />
              {t('settings.notifications')}
              {activeTab === 'notifications' && <ChevronRight className="w-4 h-4 ml-auto" />}
            </div>
            <div 
              onClick={() => setActiveTab('security')}
              className={`flex items-center font-bold p-3 rounded-xl cursor-pointer transition-colors mt-1 ${activeTab === 'security' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
            >
              <Shield className="w-5 h-5 mr-3" />
              {t('settings.security') || 'Security'}
              {activeTab === 'security' && <ChevronRight className="w-4 h-4 ml-auto" />}
            </div>
            <div 
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center font-bold p-3 rounded-xl cursor-pointer transition-colors mt-1 ${activeTab === 'privacy' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
            >
              <SettingsIcon className="w-5 h-5 mr-3" />
              {t('settings.privacy')}
              {activeTab === 'privacy' && <ChevronRight className="w-4 h-4 ml-auto" />}
            </div>
            <div 
              onClick={handleLogout}
              className="flex items-center text-red-500 font-medium p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl cursor-pointer transition-colors mt-1"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {t('settings.sign_out')}
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          {activeTab === 'general' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Appearance Section */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t('settings.appearance')}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.appearance_desc')}</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">{t('settings.theme_pref')}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('settings.theme_desc')}</p>
                    </div>
                    <button 
                      onClick={toggleTheme}
                      className="flex items-center bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl font-bold transition-colors hover:bg-slate-200 dark:hover:bg-slate-600"
                    >
                      {isDarkMode ? (
                        <><Sun className="w-4 h-4 mr-2" /> {t('settings.light_mode')}</>
                      ) : (
                        <><Moon className="w-4 h-4 mr-2" /> {t('settings.dark_mode')}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Language Section */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t('settings.language')}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.language_desc')}</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { code: 'en', name: 'English', native: 'English' },
                      { code: 'hi', name: 'Hindi', native: 'हिंदी' },
                      { code: 'mr', name: 'Marathi', native: 'मराठी' }
                    ].map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                          i18n.language === lang.code 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'
                        }`}
                      >
                        <span className={`text-lg font-bold mb-1 ${i18n.language === lang.code ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {lang.native}
                        </span>
                        <span className="text-xs text-slate-500">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Section */}
          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t('settings.notification_pref')}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.notification_desc')}</p>
                </div>
                <div className="p-6 space-y-6">
                  {[
                    { id: 'email', title: t('settings.email_notif'), desc: t('settings.email_notif_desc') },
                    { id: 'push', title: t('settings.push_notif'), desc: t('settings.push_notif_desc') },
                    { id: 'promotional', title: t('settings.promo_notif'), desc: t('settings.promo_notif_desc') }
                  ].map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-800 dark:text-slate-200">{item.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => handleToggleNotification(item.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          notifications[item.id] ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      >
                        <span 
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications[item.id] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Security Section */}
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t('settings.security') || 'Security'}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.security_desc') || 'Manage your password and authentication'}</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">{t('settings.change_password') || 'Change Password'}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('settings.change_password_desc') || 'Update your account password'}</p>
                    </div>
                    <button 
                      onClick={() => navigate('/update-password')}
                      className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold px-4 py-2 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors text-sm"
                    >
                      {t('Update')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Privacy Section */}
          {activeTab === 'privacy' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t('settings.privacy_policy') || 'Privacy & Data'}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.privacy_policy_desc') || 'Manage data collection and account deletion'}</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">{t('settings.data_collection') || 'Allow Data Collection'}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('settings.data_collection_desc') || 'We collect anonymous usage data to improve Servease'}</p>
                    </div>
                    <button 
                      onClick={() => handleToggleNotification('data')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        notifications['data'] ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    >
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications['data'] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div>
                      <h4 className="font-bold text-red-600 dark:text-red-400">{t('settings.delete_account') || 'Delete Account'}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('settings.delete_account_desc') || 'Permanently remove your account and all data'}</p>
                    </div>
                    <button 
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                          handleLogout();
                        }
                      }}
                      className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold px-4 py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm"
                    >
                      {t('Delete')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
        </div>
      </div>
    </div>
  );
}
