import { Link } from 'react-router-dom';
import { Shield, Star, Zap, ChevronRight, Search, MapPin, Award, Clock } from 'lucide-react';
import { DUMMY_SHOPS } from '../data/dummyShops';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { isShopOpen } from '../utils/timeUtils';

export default function LandingPage() {
  const { t } = useTranslation();
  const { user, role } = useAuth();
  const topServices = DUMMY_SHOPS.slice(0, 3); // Get 3 dummy shops for preview

  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* Hero Section */}
      <section className="flex-grow flex flex-col justify-center items-center text-center px-4 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent -z-10"></div>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-semibold tracking-wide">
            <Zap className="w-4 h-4" />
            <span>{t('landing.smart_recommendation') || 'Smart Service Recommendation System'}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {t('landing.find_perfect_service') || 'Find the perfect service'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-300">
              {t('landing.near_you_instantly') || 'near you, instantly.'}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('landing.hero_subtitle') || 'Servease helps you discover top-rated tailors, xerox shops, mechanics, and laundry services. We analyze price, distance, and ratings to recommend the absolute best option.'}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            {user ? (
              <Link to={role === 'admin' ? '/admin' : role === 'shopkeeper' ? '/shopkeeper' : '/user'} className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center group">
                {t('landing.go_to_dashboard') || 'Go to Dashboard'}
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center group">
                  {t('landing.get_started_now') || 'Get Started Now'}
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center">
                  {t('landing.login_to_account') || 'Login to Account'}
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('landing.top_rated_services') || 'Top Rated Services'}</h2>
            <p className="text-slate-500 dark:text-slate-400">{t('landing.join_today_subtitle') || 'Join today to book or review these amazing local shops.'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topServices.map((shop, i) => {
              const isOpen = isShopOpen(shop.openingTime, shop.closingTime);
              return (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group cursor-pointer">
                {i === 0 && (
                  <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm z-10">
                    <Award className="w-3 h-3 mr-1" /> {t('landing.top_pick') || 'Top Pick'}
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4 mt-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t(`shop_names.${shop.id}`, shop.name)}</h3>
                    <div className="flex items-center mt-1">
                      {isOpen ? (
                        <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                          {t('shop.open_now') || 'Open Now'}
                        </span>
                      ) : (
                        <span className="flex items-center text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                          {t('shop.closed') || 'Closed'}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs px-3 py-1 rounded-full font-semibold">{t(`shop_types.${shop.type.toLowerCase()}`) || shop.type}</span>
                </div>
                
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2">{t(`shop_desc.${shop.id}`, shop.description)}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-slate-700 dark:text-slate-300 text-sm">
                    <Star className="w-4 h-4 text-amber-400 mr-2 fill-amber-400" />
                    <span className="font-semibold text-slate-900 dark:text-white">{shop.rating}</span> <span className="text-slate-400 dark:text-slate-500 ml-1">({shop.reviewCount} {t('shop.reviews') || 'reviews'})</span>
                  </div>
                  <div className="flex items-center text-slate-700 dark:text-slate-300 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 mr-2" />
                    <span>{shop.distance} km {t('shop.away') || 'away'}</span>
                  </div>
                </div>

                {/* Overlay link that directs to login */}
                <Link to="/login" className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] rounded-2xl">
                  <span className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md flex items-center">
                    {t('landing.login_to_view') || 'Login to view'} <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('landing.feature_1_title') || 'Smart Discovery'}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('landing.feature_1_desc') || 'Our algorithm ranks shops by balancing distance, price, and customer reviews.'}</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('landing.feature_2_title') || 'Trusted Reviews'}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('landing.feature_2_desc') || 'Real reviews from local customers help you make the best decision.'}</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('landing.feature_3_title') || 'Grow Your Business'}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('landing.feature_3_desc') || 'Shopkeepers can easily list their services and attract nearby customers.'}</p>
          </div>
        </div>
      </section>
      {/* How it Works Section */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center mb-12">{t('landing.how_it_works') || 'How It Works'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -z-10 -translate-y-1/2"></div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center relative z-10">
              <div className="w-12 h-12 bg-primary-600 text-white font-black rounded-full flex items-center justify-center mx-auto mb-6 text-xl shadow-lg shadow-primary-500/30">1</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('landing.step1_title') || 'Search Services'}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{t('landing.step1_desc') || 'Find local shops and services around your current location instantly.'}</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center relative z-10">
              <div className="w-12 h-12 bg-primary-600 text-white font-black rounded-full flex items-center justify-center mx-auto mb-6 text-xl shadow-lg shadow-primary-500/30">2</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('landing.step2_title') || 'Compare & Choose'}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{t('landing.step2_desc') || 'Compare prices, distance, and read genuine reviews from neighbors.'}</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center relative z-10">
              <div className="w-12 h-12 bg-primary-600 text-white font-black rounded-full flex items-center justify-center mx-auto mb-6 text-xl shadow-lg shadow-primary-500/30">3</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('landing.step3_title') || 'Connect Easily'}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{t('landing.step3_desc') || 'Get directions or contact the shopkeeper directly to get your work done.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 px-4 bg-primary-900 text-white relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-600/30 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-500/20 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{t('landing.about_title') || 'Empowering Local Communities'}</h2>
          <p className="text-primary-100 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            {t('landing.about_desc') || 'Servease was born out of a simple idea: to bridge the gap between skilled local professionals and people who need them. We believe in strengthening neighborhood economies by making local services accessible, transparent, and completely hassle-free.'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-primary-700/50">
            <div>
              <div className="text-3xl font-black text-accent-400 mb-1">500+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary-200">{t('landing.stat_shops') || 'Local Shops'}</div>
            </div>
            <div>
              <div className="text-3xl font-black text-accent-400 mb-1">10k+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary-200">{t('landing.stat_users') || 'Happy Users'}</div>
            </div>
            <div>
              <div className="text-3xl font-black text-accent-400 mb-1">50+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary-200">{t('landing.stat_cities') || 'Cities Active'}</div>
            </div>
            <div>
              <div className="text-3xl font-black text-accent-400 mb-1">4.8</div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary-200">{t('landing.stat_rating') || 'App Rating'}</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
