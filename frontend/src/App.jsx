import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth.jsx';
import Login from './views/Login.jsx';
import MemberPortal from './views/MemberPortal.jsx';
import AdminDashboard from './views/AdminDashboard.jsx';

function RequireAuth({ children, role }) {
  const auth = useAuth();

  if (!auth.authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && auth.role !== role) {
    return <Navigate to={auth.role === 'admin' ? '/admin' : '/member'} replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/member"
            element={
              <RequireAuth role="member">
                <MemberPortal />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth role="admin">
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route path="/*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
