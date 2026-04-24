
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:8080/api';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Используем существующий эндпоинт /api/users для создания пользователя
      await axios.post(`${API}/users`, formData);
      toast.success('Регистрация успешна! Теперь войдите.');
      navigate('/login');
    } catch (error) {
      console.error('Register error:', error);
      if (error.response) {
        toast.error(error.response.data?.message || 'Ошибка регистрации');
      } else {
        toast.error('Ошибка соединения с сервером');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">🎓</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Регистрация</h1>
          <p className="text-gray-500 mt-2">Создайте новый аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Имя"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="student">📖 Ученик</option>
            <option value="tutor">👨‍🏫 Репетитор</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition font-semibold"
          >
            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Войти
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default RegisterPage;
