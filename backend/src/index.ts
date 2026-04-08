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

// Проверка токена
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Не авторизован' });

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Токен невалиден' });
    req.user = user;
    next();
  });
};

// --- AUTH ---

app.post('/api/register', async (req, res) => {
  try {
    const { name, surname, img, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, surname, img, email, password: hashedPassword }
    });
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Ошибка регистрации' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Неверные данные' });
    }
    const token = jwt.sign({ userId: user.id_user, email: user.email }, SECRET_KEY, { expiresIn: '7d' });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// --- TASKS ---

// Получение задач пользователя
app.get('/api/users/:userId/tasks', authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: 'Invalid User ID' });

    const tasks = await prisma.task.findMany({ 
      where: { user_id: userId },
      orderBy: { id_task: 'asc' } // Чтобы задачи не прыгали при обновлении
    });
    res.json(tasks);
  } catch (error) {
    console.error('GET Tasks Error:', error);
    res.status(500).json({ error: 'Ошибка загрузки задач' });
  }
});

// Создание задачи
app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description, type, user_id, status } = req.body;
    
    // Приводим user_id к числу принудительно
    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        type: type || 'design_system',
        user_id: Number(user_id),
        status: status || 'todo',
      }
    });
    res.json(task);
  } catch (error) {
    console.error('POST Task Error:', error); // Это покажет точную ошибку Prisma в терминале
    res.status(500).json({ error: 'Ошибка создания' });
  }
});

// Обновление задачи
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, type, status } = req.body;
    
    const task = await prisma.task.update({
      where: { id_task: id },
      data: { 
        title, 
        description, 
        type, 
        status 
      }
    });
    res.json(task);
  } catch (error) {
    console.error('PUT Task Error:', error);
    res.status(500).json({ error: 'Ошибка обновления' });
  }
});

// Удаление задачи
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.task.delete({ where: { id_task: id } });
    res.json({ success: true, message: 'Удалено' });
  } catch (error) {
    console.error('DELETE Task Error:', error);
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});