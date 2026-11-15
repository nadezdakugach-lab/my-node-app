const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  const now = new Date();
  const dateStr = now.toLocaleString('ru-RU', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <title>Лабораторная работа №16</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 40px; }
        .container { max-width: 800px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 25px; }
        .info { background: #ecf0f1; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .info p { margin: 8px 0; }
        ul { line-height: 1.8; }
        a { color: #2980b9; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Лабораторная работа №16</h1>
        <div class="info">
          <p><strong>Группа:</strong> ББМО-01-23</p>
          <p><strong>Студент:</strong> Вариант 12</p>
          <p><strong>Текущая дата и время:</strong> ${dateStr}</p>
        </div>
        <h2>Приветственное сообщение</h2>
        <p>Добро пожаловать! Это простой сервер на Express.js, созданный в рамках лабораторной работы №16.</p>
        <h2>Список доступных маршрутов</h2>
        <ul>
          <li><a href="/">/</a> — главная страница (информация о ЛР)</li>
          <li><a href="/about">/about</a> — информация о разработчике</li>
          <li><a href="/contacts">/contacts</a> — контактная информация</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

app.get('/about', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <title>О разработчике</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 40px; }
        .container { max-width: 700px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        a { color: #2980b9; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>О разработчике</h1>
        <p><strong>Студент:</strong> Вариант 12</p>
        <p><strong>Группа:</strong> ББМО-01-23</p>
        <p><strong>Дисциплина:</strong> Web-программирование</p>
        <p><strong>Лабораторная работа:</strong> №16 — Express.js</p>
        <p><strong>Задание:</strong> Базовый уровень</p>
        <p><a href="/">← На главную</a></p>
      </div>
    </body>
    </html>
  `);
});

app.get('/contacts', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <title>Контакты</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 40px; }
        .container { max-width: 700px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        a { color: #2980b9; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Контактная информация</h1>
        <p><strong>Email:</strong> student12@example.com</p>
        <p><strong>Телефон:</strong> +7 (900) 000-00-12</p>
        <p><strong>Группа:</strong> ББМО-01-23</p>
        <p><strong>Студент:</strong> Вариант 12</p>
        <p><a href="/">← На главную</a></p>
      </div>
    </body>
    </html>
  `);
});

app.use((req, res) => {
  res.status(404).send('<h1>404 — Страница не найдена</h1><a href="/">На главную</a>');
});

app.listen(PORT, () => {
  console.log(`Сервер (Задание 1) запущен на http://localhost:${PORT}`);
});