import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import ShopkeeperDashboard from './pages/ShopkeeperDashboard';
import UserDashboard from './pages/UserDashboard';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 max-w-md text-center shadow-lg">
          <h3 className="text-xl font-bold mb-2">Access Denied</h3>
          <p className="text-sm">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
}

function AppRoutes() {
  const { user, role } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50/50 dark:bg-slate-900">
      <Navbar />
      <main className={`flex-grow ${!isLandingPage ? 'container mx-auto px-4 py-8 max-w-7xl' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/shopkeeper" element={
            <ProtectedRoute allowedRoles={['shopkeeper']}>
              <ShopkeeperDashboard />
            </ProtectedRoute>
          } />

          <Route path="/user" element={
            <ProtectedRoute allowedRoles={['customer', 'user']}>
              <UserDashboard />
            </ProtectedRoute>
          } />

          {/* 404 Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { borderRadius: '10px', background: '#333', color: '#fff' } }} />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
