import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const HomePage = lazy(() => import('@/pages/HomePage'));
const MapPage = lazy(() => import('@/pages/MapPage'));
const MarketDetailsPage = lazy(() => import('@/pages/MarketDetailsPage'));
const AddMarketPage = lazy(() => import('@/pages/AddMarketPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const GoogleCallbackPage = lazy(() => import('@/pages/GoogleCallbackPage'));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="markets/:id" element={<MarketDetailsPage />} />
            <Route
              path="add"
              element={
                <ProtectedRoute>
                  <AddMarketPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="auth/callback" element={<GoogleCallbackPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
