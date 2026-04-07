import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'my-super-secret-key-2024';

app.use(cors());
app.use(express.json());

// ============ РЕГИСТРАЦИЯ ============
app.post('/api/register', async (req, res) => {
  console.log('📝 Получен запрос на регистрацию:', req.body);
  
  try {
    const { name, surname, img, email, password } = req.body;
    
    // Проверка обязательных полей
    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name: name || 'User',
        surname: surname || '',
        img: img || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        email,
        password: hashedPassword
      }
    });
    
    console.log('✅ Пользователь создан:', user.email);
    
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    console.error('❌ Ошибка регистрации:', error);
    
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    } else {
      res.status(500).json({ error: 'Ошибка сервера: ' + error.message });
    }
  }
});

// ============ ЛОГИН ============
app.post('/api/login', async (req, res) => {
  console.log('🔐 Получен запрос на вход:', req.body.email);
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверный пароль' });
    }
    
    const token = jwt.sign(
      { userId: user.id_user, email: user.email },
      SECRET_KEY,
      { expiresIn: '7d' }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('❌ Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ============ ЗАДАЧИ ============

// Получить все задачи пользователя
app.get('/api/users/:userId/tasks', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const tasks = await prisma.task.findMany({
      where: { user_id: userId }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки задач' });
  }
});

// Создать задачу
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, type, user_id } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        type: type || 'task',
        user_id
      }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания задачи' });
  }
});

// Обновить задачу
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, type } = req.body;
    const task = await prisma.task.update({
      where: { id_task: id },
      data: { title, description, type }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления задачи' });
  }
});

// Удалить задачу
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.task.delete({
      where: { id_task: id }
    });
    res.json({ message: 'Задача удалена' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления задачи' });
  }
});

// ============ ПРОВЕРКА ЗДОРОВЬЯ ============
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: 'OK', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'disconnected' });
  }
});

// ============ ЗАПУСК ============
app.listen(port, () => {
  console.log(`Сервер запущен: http://localhost:${port}`);
  console.log(`Проверка БД: http://localhost:${port}/api/health`);
});