# Используем стабильную версию Node.js
FROM node:20

# Создаем рабочую папку внутри контейнера
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
COPY prisma ./prisma/

# Устанавливаем зависимости
RUN npm install
COPY . .
RUN npx prisma generate



EXPOSE 3000
CMD ["npm", "run", "dev"]