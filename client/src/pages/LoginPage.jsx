import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:8080/api';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/users/login`, { email, password });
      
      if (res.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
        toast.success(`Добро пожаловать, ${res.data.name || res.data.email}!`);
        navigate('/', { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">📚</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Вход в систему</h1>
          <p className="text-gray-500 mt-2">Добро пожаловать обратно!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold"
          >
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default LoginPage;
