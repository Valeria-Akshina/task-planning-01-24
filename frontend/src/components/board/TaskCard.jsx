import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import styles from './TaskCard.module.css';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Используем данные из задачи для определения стилей (как было в оригинале)
  const categoryClass = task.type === 'design_system' ? 'bg-badge-green' : 
                        task.type === 'development' ? 'bg-badge-red' : 'bg-badge-blue';

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.category}>
          <span className={`${styles.categoryDot} ${categoryClass}`} />
          <span className={styles.categoryLabel}>{task.type?.replace('_', ' ').toUpperCase()}</span>
        </div>
        <div className={styles.menuWrapper}>
          <button onClick={() => setMenuOpen(!menuOpen)} className={styles.menuBtn}>
            <MoreHorizontal size={18} />
          </button>
          
          {menuOpen && (
            <div className={styles.dropdown}>
              <button 
                onClick={() => { onEdit(task); setMenuOpen(false); }} 
                className={styles.dropdownItem}
              >
                Редактировать
              </button>
              <button 
                onClick={() => { onDelete(task.id_task); setMenuOpen(false); }} 
                className={styles.dropdownItemDelete}
              >
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>
      <h3 className={styles.title}>{task.title}</h3>
      <p className={styles.description}>{task.description}</p>
    </div>
  );
};

export default TaskCard;