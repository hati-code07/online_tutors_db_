import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Plus, Edit, Trash2, User, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const API = 'http://localhost:8080/api';

function TutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTutor, setEditingTutor] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password_hash: '', phone: '', bio: '' });

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const res = await axios.get(`${API}/users`);
      setTutors(res.data.filter(u => u.role === 'tutor'));
    } catch (error) {
      toast.error('Ошибка загрузки');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить репетитора?')) return;
    try {
      await axios.delete(`${API}/users/${id}`);
      toast.success('Удалено');
      fetchTutors();
    } catch (error) {
      toast.error('Ошибка');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Подготавливаем данные для отправки
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        role: 'tutor',
        phone: formData.phone || null,
        bio: formData.bio || null
      };
      
      // Добавляем пароль только для нового репетитора
      if (!editingTutor) {
        dataToSend.password_hash = formData.password_hash;
      }
      
      if (editingTutor) {
        await axios.put(`${API}/users/${editingTutor.id}`, dataToSend);
        toast.success('Обновлено');
      } else {
        await axios.post(`${API}/users`, dataToSend);
        toast.success('Добавлено');
      }
      setShowModal(false);
      fetchTutors();
    } catch (error) {
      console.error('Ошибка:', error.response?.data);
      toast.error(error.response?.data?.message || 'Ошибка сохранения');
    }
  };

  const openModal = (tutor = null) => {
    if (tutor) {
      setEditingTutor(tutor);
      setFormData({
        name: tutor.name || '',
        email: tutor.email || '',
        password_hash: '',
        phone: tutor.phone || '',
        bio: tutor.bio || ''
      });
    } else {
      setEditingTutor(null);
      setFormData({ name: '', email: '', password_hash: '', phone: '', bio: '' });
    }
    setShowModal(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">👨‍🏫 Репетиторы</h1>
          <p className="text-gray-500 mt-1">Управление преподавателями</p>
        </div>
        <button onClick={() => openModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2">
          <Plus size={18} /><span>Добавить</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Имя</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Телефон</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tutors.map(tutor => (
                <tr key={tutor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{tutor.id}</td>
                  <td className="px-6 py-4 font-medium">{tutor.name}</td>
                  <td className="px-6 py-4 text-gray-600">{tutor.email}</td>
                  <td className="px-6 py-4 text-gray-600">{tutor.phone || '-'}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button onClick={() => openModal(tutor)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(tutor.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingTutor ? 'Редактировать' : 'Добавить'} репетитора</h3>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Имя *" 
                className="w-full p-3 border rounded-lg mb-3" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
              <input 
                type="email" 
                placeholder="Email *" 
                className="w-full p-3 border rounded-lg mb-3" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
              />
              {!editingTutor && (
                <input 
                  type="password" 
                  placeholder="Пароль *" 
                  className="w-full p-3 border rounded-lg mb-3" 
                  value={formData.password_hash} 
                  onChange={e => setFormData({...formData, password_hash: e.target.value})} 
                  required 
                />
              )}
              <input 
                type="tel" 
                placeholder="Телефон" 
                className="w-full p-3 border rounded-lg mb-3" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
              />
              <textarea 
                placeholder="О себе" 
                className="w-full p-3 border rounded-lg mb-3" 
                rows="3" 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
              />
              <div className="flex space-x-3">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Сохранить</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300">Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TutorsPage;