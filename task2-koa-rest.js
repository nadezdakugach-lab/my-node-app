const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();
const PORT = 3000;

app.use(bodyParser());

let users = [
  { id: 1, name: 'Иванов Иван', group: 'ББМО-01-23' },
  { id: 2, name: 'Петров Петр', group: 'ББМО-01-23' }
];
let nextId = 3;

router.get('/api/users', (ctx) => {
  ctx.body = users;
});

router.get('/api/users/:id', (ctx) => {
  const id = parseInt(ctx.params.id, 10);
  const user = users.find((u) => u.id === id);
  if (!user) {
    ctx.status = 404;
    ctx.body = { error: 'Пользователь не найден' };
    return;
  }
  ctx.body = user;
});

router.post('/api/users', (ctx) => {
  const { name, group } = ctx.request.body || {};
  if (!name || !group) {
    ctx.status = 400;
    ctx.body = { error: 'Поля name и group обязательны' };
    return;
  }
  const user = { id: nextId++, name, group };
  users.push(user);
  ctx.status = 201;
  ctx.body = user;
});

router.put('/api/users/:id', (ctx) => {
  const id = parseInt(ctx.params.id, 10);
  const { name, group } = ctx.request.body || {};
  if (!name || !group) {
    ctx.status = 400;
    ctx.body = { error: 'Поля name и group обязательны' };
    return;
  }
  const user = users.find((u) => u.id === id);
  if (!user) {
    ctx.status = 404;
    ctx.body = { error: 'Пользователь не найден' };
    return;
  }
  user.name = name;
  user.group = group;
  ctx.body = user;
});

router.delete('/api/users/:id', (ctx) => {
  const id = parseInt(ctx.params.id, 10);
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    ctx.status = 404;
    ctx.body = { error: 'Пользователь не найден' };
    return;
  }
  const deleted = users.splice(index, 1)[0];
  ctx.body = { message: 'Пользователь удален', user: deleted };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`REST сервер запущен на http://localhost:${PORT}`);
});