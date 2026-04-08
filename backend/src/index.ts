import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'my-super-secret-key-2024';

// --- НАСТРОЙКИ SWAGGER ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Planning API',
      version: '1.0.0',
      description: 'Интерактивная документация для управления задачами',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: {
      '/api/register': {
        post: {
          summary: 'Регистрация',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  // ОБЯЗАТЕЛЬНЫЕ ПОЛЯ ТЕПЕРЬ ТУТ:
                  required: ['name', 'surname', 'email', 'password'], 
                  properties: {
                    name: { type: 'string', example: 'Имя' },
                    surname: { type: 'string', example: 'Фамилия' },
                    img: { type: 'string', example: 'https://avatar.url' },
                    email: { type: 'string', example: 'user@example.com' },
                    password: { type: 'string', example: '123456' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Успех' } }
        }
      },
      '/api/login': {
        post: {
          summary: 'Вход',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'user@example.com' },
                    password: { type: 'string', example: '123456' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Успех' } }
        }
      },
      '/api/tasks': {
        post: {
          summary: 'Создать задачу',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'user_id'],
                  properties: {
                    title: { type: 'string', example: 'Новая задача' },
                    description: { type: 'string', example: 'Описание задачи' },
                    user_id: { type: 'number', example: 16 },
                    status: { type: 'string', example: 'todo' },
                    type: { type: 'string', example: 'design_system' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Успех' } }
        }
      }
    }
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors({
  origin: '*', // Разрешаем всем
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'] // Явно разрешаем заголовок с токеном
}));
app.use(express.json());

// Страница документации
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Проверка токена
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Не авторизован' });

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Token invalid' });
    req.user = user;
    next();
  });
};

// --- AUTH ---

/**
 * @swagger
 * /api/register:
 * post:
 * summary: Регистрация
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name: {type: string}
 * email: {type: string}
 * password: {type: string}
 */
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
    console.error("ОШИБКА ПРИЗМЫ:", error); // <-- Добавь эту строку!
    res.status(400).json({ error: 'Ошибка регистрации', details: error });
  }
});

/**
 * @swagger
 * /api/login:
 * post:
 * summary: Вход
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email: {type: string}
 * password: {type: string}
 */
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

/**
 * @swagger
 * /api/users/{userId}/tasks:
 * get:
 * summary: Получить задачи пользователя
 * tags: [Tasks]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: userId
 * required: true
 * schema: {type: integer}
 */
app.get('/api/users/:userId/tasks', authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const tasks = await prisma.task.findMany({ 
      where: { user_id: userId },
      orderBy: { id_task: 'asc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки' });
  }
});

/**
 * @swagger
 * /api/tasks:
 * post:
 * summary: Создать задачу
 * tags: [Tasks]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * title: {type: string}
 * user_id: {type: number}
 * status: {type: string}
 */
app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description, type, user_id, status } = req.body;
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
    res.status(500).json({ error: 'Ошибка создания' });
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 * delete:
 * summary: Удалить задачу
 * tags: [Tasks]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: {type: integer}
 */
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.task.delete({ where: { id_task: id } });
    res.json({ message: 'Удалено' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

app.listen(port, () => {
  console.log(`Сервер: http://localhost:${port}`);
  console.log(`Документация: http://localhost:${port}/api-docs`);
});