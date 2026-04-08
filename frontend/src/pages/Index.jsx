import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar.jsx';
import Header from '../components/layout/Header.jsx';
import BoardColumn from '../components/board/BoardColumn.jsx';
import TaskModal from '../components/modals/TaskModal.jsx';
import { useTaskContext } from '../context/TaskContext.jsx';
import styles from './Index.module.css';
import { getCurrentUser } from '../lib/api'; // Импортируй это
import AuthModal from '../components/modals/AuthModal'; // Проверь, как называется твоя модалка входа

const Index = () => {
  const user = getCurrentUser();
  const { tasks, fetchTasks, deleteTaskById } = useTaskContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  if (!user) {
    return <AuthModal open={true} />; 
  }

const STATUSES = ['todo', 'in_progress', 'done'];

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = (status) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <main className={styles.main}>
          <div className={styles.toolbar}>
            <h1 className={styles.heading}>Доска задач</h1>
          </div>
          <div className={styles.board}>
            {STATUSES.map((status) => (
              <BoardColumn
                key={status}
                status={status}
                tasks={tasks.filter((t) => t.status === status)}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={deleteTaskById}
              />
            ))}
          </div>
        </main>
      </div>
      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        // ВОТ ТУТ ВАЖНО: передаем функцию fetchTasks
        onTaskCreated={() => fetchTasks()} 
        editingTask={editingTask}
        defaultStatus={defaultStatus}
      />
    </div>
  );
};

export default Index;