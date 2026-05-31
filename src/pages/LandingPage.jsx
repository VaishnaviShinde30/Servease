import { Link } from 'react-router-dom';
import { Shield, Star, Zap, ChevronRight, Search, MapPin, Award } from 'lucide-react';
import { DUMMY_SHOPS } from '../data/dummyShops';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
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
            <span>Smart Service Recommendation System</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Find the perfect service <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-500 dark:from-primary-400 dark:to-indigo-300">
              near you, instantly.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Servease helps you discover top-rated tailors, xerox shops, mechanics, and laundry services. We analyze price, distance, and ratings to recommend the absolute best option.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            {user ? (
              <Link to={role === 'admin' ? '/admin' : role === 'shopkeeper' ? '/shopkeeper' : '/user'} className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center group">
                Go to Dashboard
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center group">
                  Get Started Now
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center">
                  Login to Account
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
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Top Rated Services</h2>
            <p className="text-slate-500 dark:text-slate-400">Join today to book or review these amazing local shops.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topServices.map((shop, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group cursor-pointer">
                {i === 0 && (
                  <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
                    <Award className="w-3 h-3 mr-1" /> Top Pick
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4 mt-2">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{shop.name}</h3>
                  <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs px-3 py-1 rounded-full font-semibold">{shop.type}</span>
                </div>
                
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2">{shop.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-slate-700 dark:text-slate-300 text-sm">
                    <Star className="w-4 h-4 text-amber-400 mr-2 fill-amber-400" />
                    <span className="font-semibold text-slate-900 dark:text-white">{shop.rating}</span> <span className="text-slate-400 dark:text-slate-500 ml-1">({shop.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center text-slate-700 dark:text-slate-300 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 mr-2" />
                    <span>{shop.distance} km away</span>
                  </div>
                </div>

                {/* Overlay link that directs to login */}
                <Link to="/login" className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] rounded-2xl">
                  <span className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md flex items-center">
                    Login to view <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              </div>
            ))}
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
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Smart Discovery</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Our algorithm ranks shops by balancing distance, price, and customer reviews.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Trusted Reviews</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Real reviews from local customers help you make the best decision.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Grow Your Business</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Shopkeepers can easily list their services and attract nearby customers.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
