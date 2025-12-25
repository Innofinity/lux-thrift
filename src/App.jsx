import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Routes>
      {/* Public Routes with Layout */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/:gender" element={<Layout><CategoryPage /></Layout>} />
      <Route path="/:gender/:category" element={<Layout><CategoryPage /></Layout>} />

      {/* Admin Login (No Layout) */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Protected Admin Route (No Layout) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
