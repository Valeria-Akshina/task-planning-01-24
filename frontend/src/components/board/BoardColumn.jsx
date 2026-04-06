import { Plus, MoreHorizontal } from 'lucide-react';
import TaskCard from './TaskCard.jsx';
import styles from './BoardColumn.module.css';

const STATUS_LABELS = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
};

const BoardColumn = ({ status, tasks, onAdd, onEdit, onDelete }) => {
  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <h2 className={styles.columnTitle}>{STATUS_LABELS[status]}</h2>
        <div className={styles.columnActions}>
          <button onClick={() => onAdd(status)} className={styles.columnBtn}>
            <Plus className={styles.columnBtnIcon} />
          </button>
          <button className={styles.columnBtn}>
            <MoreHorizontal className={styles.columnBtnIcon} />
          </button>
        </div>
      </div>
      <div className={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default BoardColumn;
