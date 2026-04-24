
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, BookOpen, ChevronRight } from 'lucide-react';

const API = 'http://localhost:8080/api';

function SchedulePage() {
  const [lessons, setLessons] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lessonsRes, usersRes] = await Promise.all([
        axios.get(`${API}/lessons`),
        axios.get(`${API}/users`)
      ]);
      setLessons(lessonsRes.data);
      setTutors(usersRes.data.filter(u => u.role === 'tutor'));
      setStudents(usersRes.data.filter(u => u.role === 'student'));
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
    setLoading(false);
  };

  const getTutorName = (id) => {
    const tutor = tutors.find(t => t.id === id);
    return tutor ? tutor.name : `ID: ${id}`;
  };

  const getStudentName = (id) => {
    const student = students.find(s => s.id === id);
    return student ? student.name : `ID: ${id}`;
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed':
        return '✅ Проведено';
      case 'cancelled':
        return '❌ Отменено';
      default:
        return '⏰ Запланировано';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Группируем занятия по репетиторам
  const groupedByTutor = lessons.reduce((acc, lesson) => {
    const tutorId = lesson.tutor_id;
    if (!acc[tutorId]) {
      acc[tutorId] = {
        tutor_id: tutorId,
        tutor_name: getTutorName(tutorId),
        lessons: []
      };
    }
    acc[tutorId].lessons.push(lesson);
    return acc;
  }, {});

  const groups = Object.values(groupedByTutor);

  if (lessons.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700">Нет занятий</h3>
        <p className="text-gray-400 mt-1">Добавьте занятия в разделе "Занятия"</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-500">Всего занятий: <span className="font-semibold text-gray-700">{lessons.length}</span></p>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.tutor_id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{group.tutor_name}</h2>
                  <p className="text-white/80 text-sm">ID: {group.tutor_id}</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                    {group.lessons.length} занятий
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Время</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ученик</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {group.lessons.map((lesson) => (
                    <tr key={lesson.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(lesson.start_time).toLocaleDateString('ru-RU')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(lesson.start_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - 
                            {new Date(lesson.end_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-900">{getStudentName(lesson.student_id)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusBadge(lesson.status)}`}>
                          {getStatusText(lesson.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SchedulePage;
