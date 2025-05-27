import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import WelcomeFunnel from './pages/WelcomeFunnel';
import NewItem from './pages/NewItem';
import EditItem from './pages/EditItem';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminSystemDocPage from './pages/AdminSystemDoc';
import Documentation from './pages/Documentation';
import Checkout from './pages/Checkout';
import { useAuthStore } from './stores/authStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loadUser = useAuthStore((state) => state.loadUser);
  const hasCompletedWelcome = localStorage.getItem('hasCompletedWelcome') === 'true';

  useEffect(() => {
    if (isAuthenticated) {
      loadUser();
    }
  }, [isAuthenticated, loadUser]);

  // Admin route protection
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated || !user?.isAdmin) {
      return <Navigate to="/dashboard" />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/documentation" element={<Documentation />} />
        
        {/* Protected routes */}
        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={!hasCompletedWelcome ? <Navigate to="/welcome" /> : <Dashboard />} />
          <Route path="/welcome" element={<WelcomeFunnel />} />
          <Route path="/items/new" element={<NewItem />} />
          <Route path="/items/:id/edit" element={<EditItem />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/documentation" element={<AdminRoute><AdminSystemDocPage /></AdminRoute>} />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 