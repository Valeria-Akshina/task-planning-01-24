const API_BASE = '/api'; // прокси перенаправит на localhost:3000

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
  user_id: number;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export async function register(userData: {
  name: string;
  surname: string;
  img: string;
  email: string;
  password: string;
}) {
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
  const data: LoginResponse = await response.json();
  
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
}

export async function getTasks(userId: number) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/users/${userId}/tasks`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function createTask(taskData: {
  title: string;
  description: string;
  type: string;
  user_id: number;
}) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  return response.json();
}

export async function updateTask(id: number, taskData: {
  title: string;
  description: string;
  type: string;
}) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  return response.json();
}

export async function deleteTask(id: number) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser(): User | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}