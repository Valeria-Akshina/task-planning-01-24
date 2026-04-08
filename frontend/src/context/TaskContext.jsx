import { createContext, useContext, useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, getCurrentUser } from '../lib/api';

const TaskContext = createContext(null);

const DEFAULT_TASKS = [
  { id_task: 'd1', title: 'Hero section', description: 'Create a design system...', status: 'todo', type: 'design_system' },
  { id_task: 'd2', title: 'Typography change', description: 'Modify typography...', status: 'todo', type: 'development' },
  { id_task: 'd3', title: 'Implement screens', description: 'Our designers created...', status: 'in_progress', type: 'testing' }
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id_user) {
      setUser(currentUser);
      // Загружаем задачи ТОЛЬКО если есть реальный ID
      fetchTasksFromServer(currentUser.id_user);
    } else {
      setTasks(DEFAULT_TASKS);
    }
  }, []);

  const fetchTasksFromServer = async (userId) => {
    if (!userId || userId === 'undefined') return;
    
    try {
      const data = await getTasks(userId);
      // Если у пользователя есть свои задачи — показываем их, если нет — пустоту
      setTasks(data); 
    } catch (e) {
      console.error("Ошибка при получении задач:", e);
      setTasks([]); 
    }
  };

  const addTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks(prev => [...prev, newTask]);
    } catch (e) {
      alert("Ошибка при создании задачи. Проверьте соединение с сервером.");
    }
  };

  const updateTaskById = async (id, updates) => {
    // Демо-задачи не трогаем
    if (typeof id === 'string' && id.startsWith('d')) return;
    
    try {
      const updated = await updateTask(id, updates);
      setTasks(prev => prev.map(t => t.id_task === id ? updated : t));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTaskById = async (id) => {
    if (typeof id === 'string' && id.startsWith('d')) return;

    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id_task !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      user, 
      fetchTasks: () => user && fetchTasksFromServer(user.id_user), 
      addTask, 
      updateTask: updateTaskById, 
      deleteTaskById 
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);