import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ReportCreate from '../pages/ReportCreate';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

import PrivateRoute from './PrivateRoute';

// Layout para páginas normales (CON Footer)
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1 main-content">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Layout para Dashboard (SIN Footer, ya que el Dashboard maneja su propio layout)
const DashboardLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <Outlet />
    <Footer />
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
        { path: 'profile', element: <PrivateRoute><Profile /></PrivateRoute> },
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