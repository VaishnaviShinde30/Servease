import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, Mail, Save, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { t } = useTranslation();
  const { user, role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      // Fetch core user data
      const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
      
      // Load extended profile from local storage for demo purposes
      const extendedProfiles = JSON.parse(localStorage.getItem('extended_profiles') || '{}');
      const localProfile = extendedProfiles[user.id] || {};

      setProfileData({
        name: data?.name || user.email?.split('@')[0] || '',
        phone: localProfile.phone || '',
        address: localProfile.address || '',
        bio: localProfile.bio || ''
      });
    } catch (error) {
      console.error('Error fetching profile', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update name in supabase
      await supabase.from('users').update({ name: profileData.name }).eq('id', user.id);
      
      // Save extended details locally for demo
      const extendedProfiles = JSON.parse(localStorage.getItem('extended_profiles') || '{}');
      extendedProfiles[user.id] = {
        phone: profileData.phone,
        address: profileData.address,
        bio: profileData.bio
      };
      localStorage.setItem('extended_profiles', JSON.stringify(extendedProfiles));
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-2xl font-bold">
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t('My Profile')}</h1>
            <p className="text-slate-500 font-medium">{t('Manage your personal information')}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                <User className="w-4 h-4 mr-2 text-slate-400" /> {t('Full Name')}
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white font-medium"
                value={profileData.name}
                onChange={e => setProfileData({...profileData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-slate-400" /> {t('Email Address')}
              </label>
              <input
                type="email"
                disabled
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-500 dark:text-slate-400 font-medium cursor-not-allowed"
                value={user?.email || ''}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-slate-400" /> {t('Contact Number')}
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white font-medium"
                value={profileData.phone}
                onChange={e => setProfileData({...profileData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-slate-400" /> {t('Location / Address')}
              </label>
              <input
                type="text"
                placeholder="e.g. Pune, Maharashtra"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white font-medium"
                value={profileData.address}
                onChange={e => setProfileData({...profileData, address: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-slate-400" /> {t('Bio / Description')}
            </label>
            <textarea
              rows="4"
              placeholder={role === 'shopkeeper' ? "Tell users about your experience and shop..." : "Tell us a bit about yourself..."}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white font-medium resize-none"
              value={profileData.bio}
              onChange={e => setProfileData({...profileData, bio: e.target.value})}
            ></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? t('Loading...') : t('Save Profile')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
