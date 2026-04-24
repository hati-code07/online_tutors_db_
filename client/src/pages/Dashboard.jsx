import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Users, BookOpen, Calendar, Award, Clock, TrendingUp } from 'lucide-react';

const API = 'http://localhost:8080/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    tutors: 0,
    subjects: 0,
    lessons: 0,
    completed: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [tutorsRes, subjectsRes, lessonsRes] = await Promise.all([
        axios.get(`${API}/users`),
        axios.get(`${API}/subjects`),
        axios.get(`${API}/lessons`)
      ]);

      const tutors = tutorsRes.data.filter(u => u.role === 'tutor');
      const completed = lessonsRes.data.filter(l => l.status === 'completed');

      setStats({
        tutors: tutors.length,
        subjects: subjectsRes.data.length,
        lessons: lessonsRes.data.length,
        completed: completed.length
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: 'Репетиторы', value: stats.tutors, icon: Users, gradient: 'from-blue-500 to-cyan-400' },
    { title: 'Дисциплины', value: stats.subjects, icon: BookOpen, gradient: 'from-purple-500 to-pink-400' },
    { title: 'Всего занятий', value: stats.lessons, icon: Calendar, gradient: 'from-green-500 to-emerald-400' },
    { title: 'Проведено', value: stats.completed, icon: Award, gradient: 'from-yellow-500 to-orange-400' }
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Загрузка дашборда...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900">📊 Дашборд</h1>
        <p className="text-gray-500 mt-2">Обзор активности платформы в реальном времени</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient}`}
                >
                  <Icon className="text-white" size={22} />
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  {card.value}
                </span>
              </div>

              <p className="mt-4 text-gray-500 font-medium">
                {card.title}
              </p>

              <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-2/3" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4">⚡ Активность</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Clock size={18} className="text-green-500" />
              Система работает стабильно
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <TrendingUp size={18} className="text-blue-500" />
              Рост занятий: +{stats.lessons ? Math.round(stats.lessons * 0.15) : 0}%
            </div>
          </div>
        </motion.div>

        {/* Pro Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <h2 className="text-lg font-bold">🚀 Pro статус</h2>
          <p className="text-white/80 mt-2 text-sm">
            Вы используете расширенную версию панели управления
          </p>

          <div className="mt-6 flex items-center gap-2">
            <Award />
            <span className="font-semibold">Администратор</span>
          </div>

          <button className="mt-6 w-full bg-white text-indigo-600 py-2 rounded-xl font-semibold hover:bg-gray-100 transition">
            Управление
          </button>
        </motion.div>

      </div>
    </div>
  );
}
