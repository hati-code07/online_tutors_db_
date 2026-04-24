import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Users, BookOpen, Calendar, LayoutDashboard, LogIn } from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import TutorsPage from './pages/TutorsPage';
import SubjectsPage from './pages/SubjectsPage';
import LessonsPage from './pages/LessonsPage';
import SchedulePage from './pages/SchedulePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function PrivateRoute({ children }) {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const user = localStorage.getItem('user');
  const userData = user ? JSON.parse(user) : null;

  if (isAuthPage) {
    return (
      <>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </>
    );
  }

  const navItems = [
    { path: '/', name: 'Дашборд', icon: LayoutDashboard, color: 'indigo' },
    { path: '/tutors', name: 'Репетиторы', icon: Users, color: 'blue' },
    { path: '/subjects', name: 'Дисциплины', icon: BookOpen, color: 'purple' },
    { path: '/lessons', name: 'Занятия', icon: Calendar, color: 'green' },
    { path: '/schedule', name: 'Расписание', icon: Calendar, color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />

      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200 z-20"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow">
              <span className="text-white font-bold">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">TutorHub</h1>
              {userData && <p className="text-xs text-gray-500">Привет, {userData.name}</p>}
            </div>
          </div>
        </div>

        <nav className="mt-6 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-4">
          <button
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
          >
            <LogIn size={16} />
            <span>Выйти</span>
          </button>
        </div>
      </motion.div>

      <div className="ml-64">
        <div className="h-16 bg-white/70 backdrop-blur border-b flex items-center justify-between px-6">
          <h2 className="font-semibold text-gray-800 capitalize">
            {location.pathname === '/' ? 'Dashboard' : location.pathname.replace('/', '')}
          </h2>
          {userData && <div className="text-sm text-gray-600">{userData.name}</div>}
        </div>

        <div className="p-6">
          <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/tutors" element={<PrivateRoute><TutorsPage /></PrivateRoute>} />
            <Route path="/subjects" element={<PrivateRoute><SubjectsPage /></PrivateRoute>} />
            <Route path="/lessons" element={<PrivateRoute><LessonsPage /></PrivateRoute>} />
            <Route path="/schedule" element={<PrivateRoute><SchedulePage /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
