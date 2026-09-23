const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();
const PORT = 3000;

app.use(async (ctx, next) => {
  const start = Date.now();
  const time = new Date().toISOString().replace('T', ' ').slice(0, 19);

  try {
    await next();
    const ms = Date.now() - start;
    console.log(`[${time}] ${ctx.method} ${ctx.path} - ${ms}ms`);
  } catch (err) {
    const ms = Date.now() - start;
    console.log(`[${time}] ${ctx.method} ${ctx.path} - ${ms}ms - ERROR: ${err.message}`);
    throw err;
  }
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      error: err.message || 'Внутренняя ошибка сервера',
      status: ctx.status
    };
  }
});

app.use(bodyParser());

const authMiddleware = async (ctx, next) => {
  const auth = ctx.headers.authorization;
  if (!auth) {
    ctx.status = 401;
    ctx.body = { error: 'Требуется авторизация', status: 401 };
    return;
  }
  await next();
};

router.get('/', (ctx) => {
  ctx.body = { message: 'OK' };
});

router.get('/protected', authMiddleware, (ctx) => {
  ctx.body = { message: 'Доступ разрешен', user: ctx.headers.authorization };
});

router.get('/error', (ctx) => {
  const err = new Error('Внутренняя ошибка сервера');
  err.status = 500;
  throw err;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Middleware сервер запущен на http://localhost:${PORT}`);
  console.log('Проверьте в браузере: / /protected /error');
});