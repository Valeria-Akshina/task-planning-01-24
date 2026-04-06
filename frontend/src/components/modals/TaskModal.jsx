import { useState, useEffect } from 'react';
import styles from './Modal.module.css';

const TASK_TYPES = {
  'design_system': 'Дизайн',
  'development': 'Разработка',
  'testing': 'Тестирование',
  'documentation': 'Документация',
  'meeting': 'Совещание',
};

const TaskModal = ({ open, onClose, onSubmit, initialData, defaultStatus = 'todo' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('design_system'); // type вместо category
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setType(initialData.type || 'design_system');
    } else {
      setTitle('');
      setDescription('');
      setType('design_system');
    }
  }, [initialData, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (initialData) {
        // Обновление задачи
        const response = await fetch(`/api/tasks/${initialData.id_task}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            type,
          }),
        });
        
        if (response.ok) {
          const updatedTask = await response.json();
          onSubmit?.(updatedTask);
          onClose();
        } else {
          const error = await response.json();
          console.error('Ошибка обновления:', error);
        }
      } else {
        // Создание задачи
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            type,
            user_id: user.id_user,
          }),
        });
        
        if (response.ok) {
          const newTask = await response.json();
          onSubmit?.(newTask);
          onClose();
        } else {
          const error = await response.json();
          console.error('Ошибка создания:', error);
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>
          {initialData ? 'Редактировать задачу' : 'Новая задача'}
        </h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <input 
            type="text" 
            placeholder="Название" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className={styles.input} 
            required 
          />
          
          <textarea 
            placeholder="Описание" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className={styles.textarea} 
          />
          
          <div>
            <label className={styles.fieldLabel}>Тип задачи</label>
            <div className={styles.categoryRow}>
              {Object.entries(TASK_TYPES).map(([key, label]) => (
                <button 
                  key={key} 
                  type="button" 
                  onClick={() => setType(key)} 
                  className={type === key ? styles.categoryBtnActive : styles.categoryBtn}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Сохранение...' : (initialData ? 'Сохранить' : 'Добавить')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
