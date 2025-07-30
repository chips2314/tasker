const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Разрешаем CORS только с GitHub Pages
app.use(cors({
  origin: 'https://chips2314.github.io',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

const usersFile = path.join(__dirname, 'users.json');
let tasks = ["Купить хлеб", "Выучить React"];

// Чтение пользователей из файла
function readUsers() {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Запись пользователей в файл
function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// === РЕГИСТРАЦИЯ ===
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Введите логин и пароль' });
  }

  const users = readUsers();
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ success: false, message: 'Пользователь уже существует' });
  }

  users.push({ username, password });
  writeUsers(users);
  res.json({ success: true });
});

// === ВХОД ===
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
  }

  res.json({ success: true });
});

// === ПОЛУЧЕНИЕ ЗАДАЧ ===
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// === ДОБАВЛЕНИЕ ЗАДАЧИ ===
app.post('/tasks', (req, res) => {
  const { task } = req.body;
  if (!task || task.trim() === '') {
    return res.status(400).json({ message: "Пустая задача" });
  }

  tasks.push(task);
  res.json(tasks);
});

// === УДАЛЕНИЕ ЗАДАЧИ ===
app.delete('/tasks/:id', (req, res) => {
  const index = parseInt(req.params.id);
  if (!isNaN(index) && tasks[index]) {
    tasks.splice(index, 1);
    res.json(tasks);
  } else {
    res.status(400).json({ message: "Неверный индекс" });
  }
});

// === СТАРТ СЕРВЕРА ===
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
