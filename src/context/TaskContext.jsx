import { createContext, useContext, useState } from 'react';
import { defaultTasks } from '../store/taskStore.js';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(defaultTasks);
  const [user, setUser] = useState(null);

  const addTask = (task) => {
    setTasks((prev) => [...prev, { ...task, id: crypto.randomUUID() }]);
  };

  const updateTask = (id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        user,
        addTask,
        updateTask,
        deleteTask,
        login: setUser,
        logout: () => setUser(null),
        register: setUser,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
};
