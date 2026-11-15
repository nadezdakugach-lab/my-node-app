const express = require('express');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  const startTime = new Date();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const ts = startTime.toISOString().replace('T', ' ').substring(0, 19);
    console.log(`[${ts}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 0
}));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Слишком много запросов, попробуйте позже', status: 429 }
});
app.use(limiter);

let books = [
  { id: 1, title: "Война и мир", author: "Толстой", year: 1869 },
  { id: 2, title: "Преступление и наказание", author: "Достоевский", year: 1866 }
];
let nextId = 3;

app.get('/api/books', (req, res) => {
  res.json(books);
});

app.get('/api/books/search', (req, res) => {
  const { author } = req.query;
  if (!author) return res.status(400).json({ error: 'author обязателен', status: 400 });
  res.json(books.filter(b => b.author.toLowerCase().includes(author.toLowerCase())));
});

app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: 'Книга не найдена', status: 404 });
  res.json(book);
});

app.post('/api/books', (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || typeof year !== 'number') {
    return res.status(400).json({ error: 'Некорректные данные', status: 400 });
  }
  const newBook = { id: nextId++, title, author, year };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: 'Книга не найдена', status: 404 });
  Object.assign(book, req.body);
  res.json(book);
});

app.delete('/api/books/:id', (req, res) => {
  const idx = books.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Книга не найдена', status: 404 });
  const deleted = books.splice(idx, 1)[0];
  res.json({ message: 'Удалено', deleted });
});

app.get('/error', (req, res) => {
  throw new Error('Тестовая синхронная ошибка');
});

app.get('/async-error', async (req, res, next) => {
  try {
    await new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Тестовая асинхронная ошибка')), 100)
    );
  } catch (e) {
    next(e);
  }
});

app.use((err, req, res, next) => {
  console.error('Ошибка:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Внутренняя ошибка сервера',
    status: err.status || 500
  });
});

app.listen(PORT, () => {
  console.log(`Сервер (Задание 3) запущен на http://localhost:${PORT}`);
});