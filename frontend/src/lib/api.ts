const API_BASE = '/api';

export interface User {
  id_user: number;
  name: string;
  surname: string;
  img: string;
  email: string;
}

export interface Task {
  id_task: number;
  title: string;
  description: string;
  type: string;
  status: string;
  user_id: number;
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export async function register(userData: any) {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
}

export function logout() {
  localStorage.clear();
}

export function getCurrentUser(): User | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export async function getTasks(userId: number) {
  const response = await fetch(`${API_BASE}/users/${userId}/tasks`, {
    headers: getHeaders(),
  });
  return response.json();
}

export async function createTask(taskData: any) {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(taskData),
  });
  return response.json();
}

export async function updateTask(id: number, taskData: any) {
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(taskData),
  });
  return response.json();
}

export async function deleteTask(id: number) {
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return response.json();
}