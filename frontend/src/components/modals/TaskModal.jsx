import { useState, useEffect } from 'react';
import { createTask, updateTask, getCurrentUser } from '../../lib/api';
import styles from './Modal.module.css';

const TASK_TYPES = {
  'design_system': 'Дизайн',
  'development': 'Разработка',
  'testing': 'Тестирование',
  'documentation': 'Документация',
  'meeting': 'Совещание',
};

const TaskModal = ({ open, onClose, onTaskCreated, editingTask, defaultStatus }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('design_system');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTask && open) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setType(editingTask.type || 'design_system');
    } else {
      setTitle('');
      setDescription('');
      setType('design_system');
    }
  }, [editingTask, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = getCurrentUser();
      if (!user) return;

      if (editingTask) {
        await updateTask(editingTask.id_task, {
          title,
          description,
          type,
          status: editingTask.status
        });
      } else {
        await createTask({
          title,
          description,
          type,
          user_id: user.id_user,
          status: defaultStatus || 'todo',
        });
      }
      
      // ИСПРАВЛЕНИЕ: вызываем только если функция существует
      if (typeof onTaskCreated === 'function') {
        onTaskCreated();
      }
      
      onClose();
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      alert("Ошибка при сохранении задачи");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>{editingTask ? 'Редактировать' : 'Новая задача'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input 
            className={styles.input} 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Заголовок" 
            required 
          />
          <textarea 
            className={styles.textarea} 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="Описание" 
          />
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
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Сохранение...' : 'Готово'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;