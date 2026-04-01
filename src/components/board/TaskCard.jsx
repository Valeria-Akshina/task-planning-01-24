import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { CATEGORY_CONFIG } from '../../store/taskStore.js';
import styles from './TaskCard.module.css';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const cat = CATEGORY_CONFIG[task.category];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.category}>
          <span className={`${styles.categoryDot} ${cat.color}`} />
          <span className={styles.categoryLabel}>{cat.label}</span>
        </div>
        <div className={styles.menuWrapper}>
          <button onClick={() => setMenuOpen(!menuOpen)} className={styles.menuBtn}>
            <MoreHorizontal className={styles.menuBtnIcon} />
          </button>
          {menuOpen && (
            <div className={styles.dropdown}>
              <button onClick={() => { onEdit(task); setMenuOpen(false); }} className={styles.dropdownItem}>
                Редактировать
              </button>
              <button onClick={() => { onDelete(task.id); setMenuOpen(false); }} className={styles.dropdownItemDelete}>
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>
      <h3 className={styles.title}>{task.title}</h3>
      <p className={styles.description}>{task.description}</p>
      <div className={styles.assignees}>
        {task.assignees.map((a, i) => (
          <div key={i} className={`${styles.assignee} ${a.color} ${i > 0 ? styles.assigneeOverlap : ''}`}>
            {a.initials}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
