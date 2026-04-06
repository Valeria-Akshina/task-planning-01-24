import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar.jsx';
import Header from '../components/layout/Header.jsx';
import BoardColumn from '../components/board/BoardColumn.jsx';
import TaskModal from '../components/modals/TaskModal.jsx';
import { useTaskContext } from '../context/TaskContext.jsx';
import styles from './Index.module.css';

const STATUSES = ['todo', 'in_progress', 'done'];

const Index = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTaskContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(undefined);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  const handleAdd = (status) => {
    setEditingTask(undefined);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
  };

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <main className={styles.main}>
          <div className={styles.toolbar}>
            <h1 className={styles.heading}>Board</h1>
            <button className={styles.weekBtn}>
              This week
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className={styles.board}>
            {STATUSES.map((status) => (
              <BoardColumn
                key={status}
                status={status}
                tasks={tasks.filter((t) => t.status === status)}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </main>
      </div>
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingTask}
        defaultStatus={defaultStatus}
      />
    </div>
  );
};

export default Index;
