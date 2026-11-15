const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let books = [
  { id: 1, title: "Война и мир", author: "Толстой", year: 1869 },
  { id: 2, title: "Преступление и наказание", author: "Достоевский", year: 1866 },
  { id: 3, title: "Мастер и Маргарита", author: "Булгаков", year: 1967 }
];
let nextId = 4;

app.get('/api/books', (req, res) => {
  res.json(books);
});

app.get('/api/books/search', (req, res) => {
  const { author } = req.query;
  if (!author) {
    return res.status(400).json({ error: 'Параметр author обязателен', status: 400 });
  }
  const result = books.filter(b =>
    b.author.toLowerCase().includes(author.toLowerCase())
  );
  res.json(result);
});

app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID должен быть числом', status: 400 });
  }
  const book = books.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({ error: 'Книга не найдена', status: 404 });
  }
  res.json(book);
});

app.post('/api/books', (req, res) => {
  const { title, author, year } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Поле title обязательно и не должно быть пустым', status: 400 });
  }
  if (!author || typeof author !== 'string' || author.trim() === '') {
    return res.status(400).json({ error: 'Поле author обязательно', status: 400 });
  }
  if (year === undefined || typeof year !== 'number' || year < 0 || year > new Date().getFullYear()) {
    return res.status(400).json({ error: 'Поле year должно быть корректным годом', status: 400 });
  }

  const newBook = {
    id: nextId++,
    title: title.trim(),
    author: author.trim(),
    year
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({ error: 'Книга не найдена', status: 404 });
  }

  const { title, author, year } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'title не должно быть пустым', status: 400 });
    }
    book.title = title.trim();
  }
  if (author !== undefined) {
    if (typeof author !== 'string' || author.trim() === '') {
      return res.status(400).json({ error: 'author не должно быть пустым', status: 400 });
    }
    book.author = author.trim();
  }
  if (year !== undefined) {
    if (typeof year !== 'number' || year < 0 || year > new Date().getFullYear()) {
      return res.status(400).json({ error: 'year некорректный', status: 400 });
    }
    book.year = year;
  }

  res.json(book);
});

app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Книга не найдена', status: 404 });
  }
  const deleted = books.splice(index, 1)[0];
  res.json({ message: 'Книга удалена', deleted });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Внутренняя ошибка сервера',
    status: err.status || 500
  });
});

app.listen(PORT, () => {
  console.log(`Сервер (Задание 2) запущен на http://localhost:${PORT}`);
});