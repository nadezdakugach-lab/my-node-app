const Koa = require('koa');

const app = new Koa();
const PORT = 3000;

app.use(async (ctx) => {
  const now = new Date();
  const dateStr = now.toLocaleString('ru-RU');

  ctx.type = 'text/html; charset=utf-8';
  ctx.body = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Лабораторная работа №15</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 20px; background: #f5f5f5; }
    h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
    .info { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .info p { margin: 10px 0; font-size: 16px; }
    .highlight { color: #3498db; font-weight: bold; }
    .greeting { margin-top: 20px; padding: 15px; background: #e8f5e9; border-left: 4px solid #4caf50; }
  </style>
</head>
<body>
  <h1>Лабораторная работа №15</h1>
  <div class="info">
    <p>Группа: <span class="highlight">477</span></p>
    <p>Дата и время: <span class="highlight">${dateStr}</span></p>
    <div class="greeting">
      <p>Добро пожаловать! Это сервер на Koa.js.</p>
    </div>
  </div>
</body>
</html>
  `;
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});