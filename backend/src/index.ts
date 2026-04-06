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
const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret-key-change-this';

app.use(cors());
app.use(express.json());

//ПОЛЬЗОВАТЕЛИ

app.post('/api/register', async (req, res) => {
  try {
    const { name, surname, img, email, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name,
        surname,
        img,
        email,
        password: hashedPassword
      }
    });
    
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: 'User with this email already exists' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    const token = jwt.sign({ userId: user.id_user, email: user.email }, SECRET_KEY);
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ЗАДАЧИ

app.get('/api/users/:userId/tasks', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const tasks = await prisma.task.findMany({
      where: { user_id: userId }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, type, user_id } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        type,
        user_id
      }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

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
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.task.delete({
      where: { id_task: id }
    });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: 'OK', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'disconnected' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});