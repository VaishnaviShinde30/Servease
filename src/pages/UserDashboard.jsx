import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { DUMMY_SHOPS } from '../data/dummyShops';
import { Star, MapPin, Tag, Award, Search, MessageSquare, Map as MapIcon, TrendingDown, Navigation, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import { isShopOpen } from '../utils/timeUtils';
import { addFeedback } from '../utils/feedbackManager';
import { useAuth } from '../context/AuthContext';
import HelpSupport from '../components/HelpSupport';

// Fix for default marker icon in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom user location icon
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically change map view
function MapUpdater({ center, zoom = 14 }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, map, zoom]);
  return null;
}

export default function UserDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [priceRange, setPriceRange] = useState('');
  const [minRating, setMinRating] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Map and routing state
  const [userLocation, setUserLocation] = useState([18.5204, 73.8567]); // Default User Location (Pune)
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [mapCenter, setMapCenter] = useState(userLocation); 
  const [selectedMapShop, setSelectedMapShop] = useState(null);
  const [mapZoom, setMapZoom] = useState(13);
  
  // Feedback modal state
  const [selectedShop, setSelectedShop] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  useEffect(() => {
    fetchShops();
    
    // Auto-locate user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = [position.coords.latitude, position.coords.longitude];
          setUserLocation(loc);
          setMapCenter(loc);
        },
        (error) => {
          console.warn('Geolocation blocked or error:', error);
          setLocationPermissionDenied(true);
        }
      );
    } else {
      setLocationPermissionDenied(true);
    }
  }, []);

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return Number(d.toFixed(1));
  }

  const fetchShops = async () => {
    try {
      const { data, error } = await supabase.from('shops').select('*');
      if (error) throw error;
      
      const dbShops = data && data.length > 0 ? data : DUMMY_SHOPS;
      const localShops = JSON.parse(localStorage.getItem('demo_shops') || '[]');
      const uniqueLocal = localShops.filter(ls => !dbShops.find(ds => ds.id === ls.id));
      setShops([...dbShops, ...uniqueLocal]);
      
    } catch (error) {
      console.error('Error fetching shops:', error);
      const localShops = JSON.parse(localStorage.getItem('demo_shops') || '[]');
      setShops([...DUMMY_SHOPS, ...localShops]);
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedShop) return;
    
    try {
      // Demo logic: update the local shops array to reflect the new rating
      const updatedShops = shops.map(shop => {
        if (shop.id === selectedShop.id) {
          const newReviewCount = (shop.reviewCount || 0) + 1;
          // Demo logic: Weight the user's rating heavily (50%) so they can visibly see the change
          const isFirstReview = !shop.reviewCount || shop.reviewCount === 0;
          const newRating = isFirstReview ? rating : (shop.rating + rating) / 2;
          return { ...shop, rating: Math.min(Number(newRating.toFixed(1)), 5), reviewCount: newReviewCount };
        }
        return shop;
      });
      setShops(updatedShops);
      localStorage.setItem('demo_shops', JSON.stringify(updatedShops.filter(s => !DUMMY_SHOPS.find(d => d.id === s.id))));
      
      // Save the feedback globally
      addFeedback(selectedShop.id, user?.id || 'anonymous', user?.email || 'Anonymous User', rating, review);
      
      toast.success('Thank you for your feedback!');
      setSelectedShop(null);
      setReview('');
      setRating(5);
    } catch (error) {
      toast.success('Demo mode: Feedback received!');
      setSelectedShop(null);
    }
  };

  const handleViewOnMap = (shop) => {
    if (shop.lat && shop.lng) {
      setSelectedMapShop(shop);
      // Center the map between user and shop
      const midLat = (userLocation[0] + shop.lat) / 2;
      const midLng = (userLocation[1] + shop.lng) / 2;
      setMapCenter([midLat, midLng]);
      setMapZoom(13); // Zoom out slightly to see both
      
      // Scroll to top on mobile so they see the map
      if (window.innerWidth < 1024) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      toast.error("Location data not available for this shop.");
    }
  };

  const openGoogleMapsDirections = (shop) => {
    if (shop.lat && shop.lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${shop.lat},${shop.lng}`, '_blank');
    }
  };

  // Filter Logic
  const shopsWithDistance = shops.map(shop => {
    let dist = null;
    let isDynamic = false;
    if (shop.lat && shop.lng && !locationPermissionDenied) {
      dist = getDistanceFromLatLonInKm(userLocation[0], userLocation[1], shop.lat, shop.lng);
      isDynamic = true;
    } else {
      dist = shop.distance; // Fallback to original db distance from city center
    }
    return { ...shop, distance: dist, isDynamicDistance: isDynamic };
  });

  const filteredShops = shopsWithDistance.filter(shop => {
    if (searchQuery && !shop.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterType !== 'All' && shop.type !== filterType) return false;
    if (priceRange && priceRange !== 'All') {
      if (priceRange.includes('-')) {
        const [min, max] = priceRange.split('-').map(Number);
        if (!isNaN(min) && shop.price < min) return false;
        if (!isNaN(max) && shop.price > max) return false;
      } else {
        const val = Number(priceRange);
        if (!isNaN(val) && shop.price < val) return false;
      }
    }
    if (minRating && shop.rating < Number(minRating)) return false;
    return true;
  });

  // Recommendation Logic
  const getRecommendedShops = () => {
    if (filteredShops.length === 0) return [];
    
    const maxP = Math.max(...filteredShops.map(s => s.price));
    const maxD = Math.max(...filteredShops.map(s => s.distance || 0));

    const scoredShops = filteredShops.map(shop => {
      const pScore = maxP === 0 ? 1 : 1 - (shop.price / maxP);
      const dScore = (maxD === 0 || shop.distance === null) ? 1 : 1 - (shop.distance / maxD);
      const rScore = shop.rating / 5;

      const totalScore = (0.4 * rScore) + (0.3 * pScore) + (0.3 * dScore);
      // Simulate market price (+20% avg)
      const marketPrice = Math.round(shop.price * 1.2); 
      return { ...shop, recommendationScore: totalScore, marketPrice };
    });

    return scoredShops.sort((a, b) => b.recommendationScore - a.recommendationScore);
  };

  const rankedShops = getRecommendedShops();
  const serviceTypes = ['All', ...new Set(shops.map(s => s.type))];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('user.discover_services') || 'Discover Services'}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t('user.find_best_rated') || 'Find the best-rated shops near you'}</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full lg:w-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 z-20 items-center">
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700 transition-colors focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/50 flex-grow min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search for Xerox, Tailor, or other stores..." 
              className="bg-transparent text-sm outline-none w-full text-slate-700 dark:text-slate-200 font-medium placeholder-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && rankedShops.length > 0) {
                  handleViewOnMap(rankedShops[0]);
                } else if (e.key === 'Enter') {
                  toast.error("No shops found for this search.");
                }
              }}
            />
          </div>

          <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700 transition-colors focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/50">
            <Tag className="w-4 h-4 text-primary-500 mr-2" />
            <select 
              className="bg-transparent text-sm outline-none text-slate-700 dark:text-slate-200 font-medium"
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              {serviceTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700 transition-colors focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/50">
            <span className="text-primary-500 font-bold mr-2">₹</span>
            <input 
              list="price-options"
              className="bg-transparent text-sm outline-none text-slate-700 dark:text-slate-200 font-medium w-32"
              placeholder="e.g. 100-120"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            />
            <datalist id="price-options">
              <option value="All">{t('user.any_price') || 'Any Price'}</option>
              <option value="0-100">0 - 100</option>
              <option value="100-500">100 - 500</option>
              <option value="500-1000">500 - 1000</option>
              <option value="1000">1000+</option>
            </datalist>
          </div>


        </div>
      </div>

      {loading ? (
        <div className="flex flex-col-reverse lg:flex-row gap-8 items-start w-full">
          {/* Skeleton List */}
          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col gap-6">
            {[1,2,3].map(n => (
              <div key={n} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm animate-pulse">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-2/3 mb-4"></div>
                <div className="h-24 bg-slate-100 dark:bg-slate-700/50 rounded-md w-full mb-6"></div>
                <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-full mt-6"></div>
              </div>
            ))}
          </div>
          {/* Skeleton Map */}
          <div className="w-full lg:w-[55%] xl:w-[60%] h-[400px] lg:h-[800px] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-3xl border border-slate-100 dark:border-slate-700"></div>
        </div>
      ) : (
        <div className="flex flex-col-reverse lg:flex-row gap-8 items-start relative">
          
          {/* Shop List (Left Side) */}
          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col gap-6 lg:h-[800px] lg:overflow-y-auto lg:pr-4 lg:-mr-4 custom-scrollbar">
            <AnimatePresence>
              {rankedShops.map((shop, index) => {
                const isBest = index === 0 && filteredShops.length > 1;
                const isSelected = selectedMapShop?.id === shop.id;
                const isOpen = isShopOpen(shop.openingTime, shop.closingTime);
                
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    key={shop.id} 
                    className={`group relative bg-white dark:bg-slate-800 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl ${isSelected ? 'ring-2 ring-primary-500 shadow-lg' : ''} ${isBest ? 'border-2 border-primary-500 shadow-primary-500/20 shadow-lg' : 'border border-slate-100 dark:border-slate-700 shadow-sm'}`}
                  >
                    {isBest && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-primary-600 to-secondary-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center shadow-md z-10">
                        <Award className="w-3 h-3 mr-1" /> {t('Top Pick')}
                      </div>
                    )}
                  
                  <div className="mt-2 mb-5 pr-20">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{shop.name}</h3>
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
                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider">{t(`shop_types.${shop.type.toLowerCase()}`) || shop.type}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">{shop.description}</p>
                    
                    <div className="mt-3 space-y-2">
                      {shop.address && (
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3 h-3 mr-2" />
                          <span className="truncate">{shop.address}</span>
                        </div>
                      )}
                      {shop.contact && (
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <Phone className="w-3 h-3 mr-2" />
                          <span>{shop.contact}</span>
                        </div>
                      )}
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                        <Navigation className="w-3 h-3 mr-2" />
                        <span>{shop.distance == null ? t('Location unavailable') : shop.isDynamicDistance ? `${shop.distance} ${t('km from you')}` : `${shop.distance} ${t('km from city center')}`}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-xl text-slate-900 dark:text-white">₹{shop.price}</span>
                      </div>
                      <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-xs bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        vs ₹{shop.marketPrice} {t('market')}
                      </div>
                    </div>
                    <div className="flex items-center text-slate-700 dark:text-slate-300 text-sm">
                      <Star className={`w-4 h-4 mr-2 ${shop.rating > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                      <span className="font-bold text-slate-900 dark:text-white">{shop.rating > 0 ? shop.rating : 'New'}</span> <span className="text-slate-400 dark:text-slate-500 ml-1">({shop.reviewCount || 0} {t('reviews')})</span>
                    </div>
                      <div className="flex gap-2">
                        <button onClick={() => openGoogleMapsDirections(shop)} className="flex-1 text-center py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-xs flex items-center justify-center">
                          <Navigation className="w-3 h-3 mr-1" /> {t('Get Directions')}
                        </button>
                        <button onClick={() => handleViewOnMap(shop)} className="flex-1 text-center py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors text-xs flex items-center justify-center">
                          <MapIcon className="w-3 h-3 mr-1" /> {t('Locate')}
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedShop(shop)}
                      className="w-full mt-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-bold transition-all flex justify-center items-center"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {t('Leave Feedback')}
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {rankedShops.length === 0 && !loading && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700"
              >
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('user.no_matches_found') || 'No matches found'}</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm">{t('user.no_matches_subtitle') || 'We couldn\'t find any services matching your specific filters. Try adjusting them.'}</p>
                <button 
                  onClick={() => {setFilterType('All'); setPriceRange(''); setMinRating('');}} 
                  className="mt-6 px-6 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold rounded-xl hover:bg-primary-200 transition-colors"
                >
                  {t('Clear All Filters')}
                </button>
              </motion.div>
            )}
          </div>

          {/* Sticky Map (Right Side) */}
          <div className="w-full lg:w-[55%] xl:w-[60%] h-[400px] lg:h-[800px] lg:sticky lg:top-28 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 z-10">
            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapUpdater center={mapCenter} zoom={mapZoom} />
              
              {/* User Location Marker */}
              <Marker position={userLocation} icon={userIcon}>
                <Popup className="font-sans">
                  <div className="font-bold text-slate-800">Your Location</div>
                  <div className="text-xs text-slate-500">Searching nearby...</div>
                </Popup>
              </Marker>

              {/* Shop Markers */}
              {rankedShops.map((shop) => (
                shop.lat && shop.lng && (
                  <Marker key={shop.id} position={[shop.lat, shop.lng]}>
                    <Popup className="font-sans">
                      <div className="p-1 min-w-[150px]">
                        <h3 className="font-bold text-lg text-slate-800">{shop.name}</h3>
                        <p className="text-xs text-slate-500 mb-2 font-semibold uppercase">{shop.type}</p>
                        <div className="flex items-center text-sm font-bold text-slate-700 bg-slate-50 p-2 rounded-lg mb-3">
                          <Star className="w-3 h-3 text-amber-500 mr-1" /> {shop.rating}
                          <span className="mx-2 text-slate-300">|</span>
                          ₹{shop.price}
                        </div>
                        <button 
                          onClick={() => openGoogleMapsDirections(shop)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex justify-center items-center"
                        >
                          <Navigation className="w-3 h-3 mr-1" /> Get Directions
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}

              {/* Routing Line (Polyline) to selected shop */}
              {selectedMapShop && selectedMapShop.lat && selectedMapShop.lng && (
                <Polyline 
                  positions={[userLocation, [selectedMapShop.lat, selectedMapShop.lng]]} 
                  color="#4f46e5" 
                  weight={4}
                  dashArray="10, 10"
                  opacity={0.8}
                />
              )}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <AnimatePresence>
        {selectedShop && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100"
            >
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Rate {selectedShop.name}</h3>
              <p className="text-slate-500 text-sm mb-8 font-medium">Your feedback directly influences the recommendation engine.</p>
              
              <form onSubmit={submitFeedback} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Your Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(num => (
                      <button 
                        key={num} type="button" onClick={() => setRating(num)}
                        className={`p-2 rounded-full transition-transform hover:scale-110 ${rating >= num ? 'text-amber-400' : 'text-slate-200'}`}
                      >
                        <Star className={`w-10 h-10 ${rating >= num ? 'fill-amber-400' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Write a Review</label>
                  <textarea 
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none h-32 resize-none transition-all shadow-sm"
                    placeholder="Tell us about your experience..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setSelectedShop(null)} className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all">Submit</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <HelpSupport />
    </div>
  );
}
