import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Plus, Edit, Trash2, BookOpen, DollarSign, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const API = 'http://localhost:8080/api';

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', duration: '' });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${API}/subjects`);
      setSubjects(res.data);
    } catch (error) {
      toast.error('Ошибка загрузки дисциплин');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить дисциплину? Это может повлиять на связанные занятия.')) return;
    try {
      await axios.delete(`${API}/subjects/${id}`);
      toast.success('Дисциплина удалена');
      fetchSubjects();
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await axios.put(`${API}/subjects/${editingSubject.id}`, formData);
        toast.success('Дисциплина обновлена');
      } else {
        await axios.post(`${API}/subjects`, formData);
        toast.success('Дисциплина добавлена');
      }
      setShowModal(false);
      fetchSubjects();
    } catch (error) {
      toast.error('Ошибка сохранения');
    }
  };

  const openModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({ 
        name: subject.name || '', 
        description: subject.description || '', 
        price: subject.price || '', 
        duration: subject.duration || '60' 
      });
    } else {
      setEditingSubject(null);
      setFormData({ name: '', description: '', price: '', duration: '60' });
    }
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📚 Дисциплины</h1>
          <p className="text-gray-500 mt-1">Управление предметами и ценами</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal()}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Добавить дисциплину</span>
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, idx) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-24 relative">
              <div className="absolute -bottom-6 left-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="text-purple-600" size={24} />
              </div>
            </div>
            
            <div className="p-5 pt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{subject.name}</h3>
              {subject.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{subject.description}</p>
              )}
              
              <div className="space-y-2 mt-3">
                {subject.price && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <DollarSign size={14} /> Цена:
                    </span>
                    <span className="font-semibold text-green-600">{subject.price} ₽/час</span>
                  </div>
                )}
                {subject.duration && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock size={14} /> Длительность:
                    </span>
                    <span className="font-semibold text-gray-700">{subject.duration} мин</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => openModal(subject)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(subject.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {subjects.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Нет дисциплин</h3>
          <p className="text-gray-400 mt-1">Добавьте первую дисциплину, нажав кнопку выше</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">
              {editingSubject ? '✏️ Редактировать дисциплину' : '➕ Добавить дисциплину'}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Название дисциплины *"
                className="w-full p-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Описание"
                className="w-full p-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <input
                type="number"
                placeholder="Цена за занятие (₽)"
                className="w-full p-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
              <select
                className="w-full p-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
              >
                <option value="30">30 минут</option>
                <option value="45">45 минут</option>
                <option value="60">60 минут</option>
                <option value="90">90 минут</option>
                <option value="120">120 минут</option>
              </select>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:shadow-lg transition font-semibold"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition font-semibold"
                >
                  Отмена
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default SubjectsPage;