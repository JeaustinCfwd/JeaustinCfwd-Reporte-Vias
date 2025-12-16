import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ReportCreate from '../pages/ReportCreate';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';
import NotFound404 from '../pages/NotFound404';

import PrivateRoute from './PrivateRoute';

// Layout para páginas normales (CON Footer)
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1 main-content">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Layout para página 404 (SIN Footer)
const NotFoundLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1 main-content">
      <Outlet />
    </main>
    {/* Footer eliminado para 404 */}
  </div>
);

// Layout para Dashboard (SIN Footer)
const DashboardLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <Outlet />
    {/* <Footer /> */}
  </div>
);

// Layout para Perfil (SIN Footer)
const ProfileLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <Outlet />
  </div>
);

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'reportCreate', element: <PrivateRoute><ReportCreate /></PrivateRoute> },
      ],
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { index: true, element: <PrivateRoute><Dashboard /></PrivateRoute> },
      ],
    },
    {
      path: '/profile',
      element: <ProfileLayout />,
      children: [
        { index: true, element: <PrivateRoute><Profile /></PrivateRoute> },
      ],
    },
    {
      path: '/admin-dashboard',
      element: <DashboardLayout />,
      children: [
        { index: true, element: <PrivateRoute><AdminDashboard /></PrivateRoute> },
      ],
    },
    {
      path: '/404',
      element: <NotFoundLayout />,
      children: [
        { index: true, element: <NotFound404 /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

function Routing() {
  return <RouterProvider router={router} />;
}

export default Routing;