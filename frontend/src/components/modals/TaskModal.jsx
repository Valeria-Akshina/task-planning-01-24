import { useState, useEffect } from 'react';
import { CATEGORY_CONFIG, AVATAR_COLORS } from '../../store/taskStore.js';
import styles from './Modal.module.css';

const TaskModal = ({ open, onClose, onSubmit, initialData, defaultStatus = 'todo' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('design_system');
  const [assignees, setAssignees] = useState([]);
  const [newInitials, setNewInitials] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCategory(initialData.category);
      setAssignees(initialData.assignees);
    } else {
      setTitle('');
      setDescription('');
      setCategory('design_system');
      setAssignees([]);
    }
  }, [initialData, open]);

  const addAssignee = () => {
    if (newInitials.trim().length >= 1) {
      const color = AVATAR_COLORS[assignees.length % AVATAR_COLORS.length];
      setAssignees([...assignees, { initials: newInitials.trim().toUpperCase().slice(0, 2), color }]);
      setNewInitials('');
    }
  };

  const removeAssignee = (index) => {
    setAssignees(assignees.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      status: initialData?.status ?? defaultStatus,
      category,
      assignees,
    });
    onClose();
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
          <input type="text" placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.input} required />
          <textarea placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.textarea} />
          <div>
            <label className={styles.fieldLabel}>Категория</label>
            <div className={styles.categoryRow}>
              {Object.keys(CATEGORY_CONFIG).map((cat) => (
                <button key={cat} type="button" onClick={() => setCategory(cat)} className={category === cat ? styles.categoryBtnActive : styles.categoryBtn}>
                  <span className={`${styles.categoryDot} ${CATEGORY_CONFIG[cat].color}`} />
                  {CATEGORY_CONFIG[cat].label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={styles.fieldLabel}>Участники</label>
            <div className={styles.assigneesList}>
              {assignees.map((a, i) => (
                <button key={i} type="button" onClick={() => removeAssignee(i)} className={`${styles.assigneeBtn} ${a.color}`} title="Нажмите чтобы удалить">
                  {a.initials}
                </button>
              ))}
              <div className={styles.assigneeInput}>
                <input type="text" placeholder="AB" value={newInitials} onChange={(e) => setNewInitials(e.target.value)} maxLength={2} className={styles.initialsInput} />
                <button type="button" onClick={addAssignee} className={styles.addBtn}>+</button>
              </div>
            </div>
          </div>
          <button type="submit" className={styles.submitBtn}>
            {initialData ? 'Сохранить' : 'Добавить'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
