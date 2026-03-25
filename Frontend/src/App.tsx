import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import HoopsTCG from './pages/HoopsTCG';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/hoops" replace /> : <LoginPage />}
      />
      <Route
        path="/hoops"
        element={
          <ProtectedRoute>
            <HoopsTCG />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
