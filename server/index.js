const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;


app.use(cors({
  origin: 'https://chips2314.github.io',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: false
}));

const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, 'users.json');
app.use(cors());
app.use(express.json());
 
function readUsers() {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}
 
function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

//let users = [{ username: 'admin', password: '1234' }];

let tasks = ["Купить хлеб", "Выучить React"];


//рег
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Введите логин и пароль' });
  }

  const users = readUsers();

  const exists = users.find(user => user.username === username);
  if (exists) {
    return res.status(400).json({ success: false, message: 'Пользователь уже существует' });
  }

  users.push({ username, password });
  writeUsers(users);

  res.json({ success: true });
});

//вход
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Введите логин и пароль' });
  }

  const users = readUsers();

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
  }

  res.json({ success: true });
});


//получить список
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

//добавить
app.post('/tasks', (req, res) => {
  const { task } = req.body;
  if (task) {
    tasks.push(task);
    res.json(tasks);
  } else {
    res.status(400).json({ message: "Пустая задача" });
  }
});

//удалить
app.delete('/tasks/:id', (req, res) => {
  const index = parseInt(req.params.id);
  if (!isNaN(index) && tasks[index]) {
    tasks.splice(index, 1);
    res.json(tasks);
  } else {
    res.status(400).json({ message: "Неверный индекс" });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
