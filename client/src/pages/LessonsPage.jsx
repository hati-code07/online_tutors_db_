
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:8080/api';

function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    tutor_id: '',
    subject_id: '',
    start_time: '',
    end_time: '',
    status: 'scheduled'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lessonsRes, usersRes, subjectsRes] = await Promise.all([
        axios.get(API + '/lessons'),
        axios.get(API + '/users'),
        axios.get(API + '/subjects')
      ]);
      setLessons(lessonsRes.data);
      setTutors(usersRes.data.filter(function(u) { return u.role === 'tutor'; }));
      setStudents(usersRes.data.filter(function(u) { return u.role === 'student'; }));
      setSubjects(subjectsRes.data);
    } catch (error) {
      toast.error('Ошибка загрузки');
    }
    setLoading(false);
  };

  const getTutorName = function(id) {
    var tutor = tutors.find(function(t) { return t.id === id; });
    return tutor ? tutor.name : 'ID: ' + id;
  };

  const getStudentName = function(id) {
    var student = students.find(function(s) { return s.id === id; });
    return student ? student.name : 'ID: ' + id;
  };

  const getSubjectName = function(id) {
    var subject = subjects.find(function(s) { return s.id === id; });
    return subject ? subject.name : '-';
  };

  const handleDelete = async function(id) {
    if (!confirm('Удалить занятие?')) return;
    try {
      await axios.delete(API + '/lessons/' + id);
      toast.success('Удалено');
      fetchData();
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  const handleSubmit = async function(e) {
    e.preventDefault();
    
    if (!formData.start_time || !formData.end_time) {
      toast.error('Укажите время начала и окончания');
      return;
    }

    var dataToSend = {
      student_id: parseInt(formData.student_id),
      tutor_id: parseInt(formData.tutor_id),
      subject_id: formData.subject_id ? parseInt(formData.subject_id) : null,
      start_time: formData.start_time,
      end_time: formData.end_time,
      status: formData.status
    };

    try {
      if (editingLesson) {
        await axios.put(API + '/lessons/' + editingLesson.id, dataToSend);
        toast.success('Занятие обновлено');
      } else {
        await axios.post(API + '/lessons', dataToSend);
        toast.success('Занятие добавлено');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error('Ошибка сохранения');
      console.error(error);
    }
  };

  const openModal = function(lesson) {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        student_id: lesson.student_id || '',
        tutor_id: lesson.tutor_id || '',
        subject_id: lesson.subject_id || '',
        start_time: lesson.start_time ? lesson.start_time.slice(0, 16) : '',
        end_time: lesson.end_time ? lesson.end_time.slice(0, 16) : '',
        status: lesson.status || 'scheduled'
      });
    } else {
      setEditingLesson(null);
      setFormData({
        student_id: '',
        tutor_id: '',
        subject_id: '',
        start_time: '',
        end_time: '',
        status: 'scheduled'
      });
    }
    setShowModal(true);
  };

  const getStatusBadge = function(status) {
    if (status === 'completed') return 'bg-green-100 text-green-700';
    if (status === 'cancelled') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const updateStatus = async function(id, newStatus) {
    try {
      await axios.patch(API + '/lessons/' + id, { status: newStatus });
      toast.success('Статус обновлён');
      fetchData();
    } catch (error) {
      toast.error('Ошибка');
    }
  };

  if (loading) {
    return React.createElement('div', { className: 'flex items-center justify-center h-screen' }, 'Загрузка...');
  }

  return React.createElement('div', { className: 'p-8' },
    React.createElement('div', { className: 'flex justify-between items-center mb-6' },
      React.createElement('div', null,
        React.createElement('h1', { className: 'text-3xl font-bold text-gray-800' }, '📅 Занятия'),
        React.createElement('p', { className: 'text-gray-500 mt-1' }, 'Управление расписанием')
      ),
      React.createElement('button', {
        onClick: function() { openModal(null); },
        className: 'bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700'
      }, '+ Добавить занятие')
    ),
    React.createElement('div', { className: 'bg-white rounded-2xl shadow-lg overflow-hidden' },
      React.createElement('div', { className: 'overflow-x-auto' },
        React.createElement('table', { className: 'w-full' },
          React.createElement('thead', { className: 'bg-gray-50 border-b' },
            React.createElement('tr', null,
              React.createElement('th', { className: 'px-6 py-3 text-left text-sm font-semibold' }, 'ID'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-sm font-semibold' }, 'Ученик'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-sm font-semibold' }, 'Репетитор'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-sm font-semibold' }, 'Предмет'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-sm font-semibold' }, 'Начало'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-sm font-semibold' }, 'Конец'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-sm font-semibold' }, 'Статус'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-sm font-semibold' }, 'Действия')
            )
          ),
          React.createElement('tbody', { className: 'divide-y' },
            lessons.map(function(lesson) {
              return React.createElement('tr', { key: lesson.id, className: 'hover:bg-gray-50' },
                React.createElement('td', { className: 'px-6 py-4 text-sm' }, lesson.id),
                React.createElement('td', { className: 'px-6 py-4 text-sm' }, getStudentName(lesson.student_id)),
                React.createElement('td', { className: 'px-6 py-4 text-sm' }, getTutorName(lesson.tutor_id)),
                React.createElement('td', { className: 'px-6 py-4 text-sm' }, getSubjectName(lesson.subject_id)),
                React.createElement('td', { className: 'px-6 py-4 text-sm' }, lesson.start_time ? new Date(lesson.start_time).toLocaleString('ru-RU') : '-'),
                React.createElement('td', { className: 'px-6 py-4 text-sm' }, lesson.end_time ? new Date(lesson.end_time).toLocaleString('ru-RU') : '-'),
                React.createElement('td', { className: 'px-6 py-4' },
                  React.createElement('select', {
                    value: lesson.status,
                    onChange: function(e) { updateStatus(lesson.id, e.target.value); },
                    className: 'px-3 py-1 text-xs rounded-full font-semibold ' + getStatusBadge(lesson.status) + ' border-0 cursor-pointer'
                  },
                    React.createElement('option', { value: 'scheduled' }, '⏰ Запланировано'),
                    React.createElement('option', { value: 'completed' }, '✅ Проведено'),
                    React.createElement('option', { value: 'cancelled' }, '❌ Отменено')
                  )
                ),
                React.createElement('td', { className: 'px-6 py-4 space-x-2' },
                  React.createElement('button', { onClick: function() { openModal(lesson); }, className: 'text-blue-600' }, '✏️'),
                  React.createElement('button', { onClick: function() { handleDelete(lesson.id); }, className: 'text-red-600' }, '🗑️')
                )
              );
            })
          )
        )
      )
    ),
    lessons.length === 0 && !loading && React.createElement('div', { className: 'text-center py-12 text-gray-500' }, 'Нет занятий. Добавьте первое занятие!'),
    showModal && React.createElement('div', { className: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto' },
      React.createElement('div', { className: 'bg-white rounded-2xl p-6 w-full max-w-md my-8' },
        React.createElement('h3', { className: 'text-xl font-bold mb-4' }, editingLesson ? '✏️ Редактировать занятие' : '➕ Добавить занятие'),
        React.createElement('form', { onSubmit: handleSubmit },
          React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Ученик *'),
          React.createElement('select', {
            className: 'w-full p-3 border rounded-lg mb-3',
            value: formData.student_id,
            onChange: function(e) { setFormData({ ...formData, student_id: e.target.value }); },
            required: true
          },
            React.createElement('option', { value: '' }, 'Выберите ученика'),
            students.map(function(s) {
              return React.createElement('option', { key: s.id, value: s.id }, s.name);
            })
          ),
          React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Репетитор *'),
          React.createElement('select', {
            className: 'w-full p-3 border rounded-lg mb-3',
            value: formData.tutor_id,
            onChange: function(e) { setFormData({ ...formData, tutor_id: e.target.value }); },
            required: true
          },
            React.createElement('option', { value: '' }, 'Выберите репетитора'),
            tutors.map(function(t) {
              return React.createElement('option', { key: t.id, value: t.id }, t.name);
            })
          ),
          React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Предмет (необязательно)'),
          React.createElement('select', {
            className: 'w-full p-3 border rounded-lg mb-3',
            value: formData.subject_id,
            onChange: function(e) { setFormData({ ...formData, subject_id: e.target.value }); }
          },
            React.createElement('option', { value: '' }, 'Без предмета'),
            subjects.map(function(s) {
              return React.createElement('option', { key: s.id, value: s.id }, s.name);
            })
          ),
          React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Время начала *'),
          React.createElement('input', {
            type: 'datetime-local',
            className: 'w-full p-3 border rounded-lg mb-3',
            value: formData.start_time,
            onChange: function(e) { setFormData({ ...formData, start_time: e.target.value }); },
            required: true
          }),
          React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Время окончания *'),
          React.createElement('input', {
            type: 'datetime-local',
            className: 'w-full p-3 border rounded-lg mb-4',
            value: formData.end_time,
            onChange: function(e) { setFormData({ ...formData, end_time: e.target.value }); },
            required: true
          }),
          React.createElement('div', { className: 'flex space-x-3' },
            React.createElement('button', { type: 'submit', className: 'flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700' }, 'Сохранить'),
            React.createElement('button', { type: 'button', onClick: function() { setShowModal(false); }, className: 'flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300' }, 'Отмена')
          )
        )
      )
    )
  );
}

export default LessonsPage;
