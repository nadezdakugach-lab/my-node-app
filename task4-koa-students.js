const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();
const PORT = 3000;

app.use(bodyParser());

let students = [
  { id: 1, name: 'Анна Иванова', group: 'ББМО-01-23', course: 1 },
  { id: 2, name: 'Борис Петров', group: 'ББМО-01-23', course: 2 },
  { id: 3, name: 'Виктор Сидоров', group: 'ББМО-02-23', course: 1 },
  { id: 4, name: 'Галина Кузнецова', group: 'ББМО-01-23', course: 3 },
  { id: 5, name: 'Дмитрий Смирнов', group: 'ББМО-02-23', course: 2 }
];
let nextId = 6;

router.get('/students', (ctx) => {
  const { group } = ctx.query;
  if (group) {
    ctx.body = students.filter((s) => s.group === group);
  } else {
    ctx.body = students;
  }
});

router.get('/students/:id', (ctx) => {
  const id = parseInt(ctx.params.id, 10);
  const student = students.find((s) => s.id === id);
  if (!student) {
    ctx.status = 404;
    ctx.body = { error: 'Студент не найден' };
    return;
  }
  ctx.body = student;
});

router.post('/students', (ctx) => {
  const { name, group, course } = ctx.request.body || {};

  if (!name || !group || course === undefined) {
    ctx.status = 400;
    ctx.body = { error: 'Все поля обязательны: name, group, course' };
    return;
  }

  if (typeof course !== 'number' || course < 1 || course > 4) {
    ctx.status = 400;
    ctx.body = { error: 'Поле course должно быть числом от 1 до 4' };
    return;
  }

  const student = { id: nextId++, name, group, course };
  students.push(student);
  ctx.status = 201;
  ctx.body = student;
});

router.put('/students/:id', (ctx) => {
  const id = parseInt(ctx.params.id, 10);
  const student = students.find((s) => s.id === id);

  if (!student) {
    ctx.status = 404;
    ctx.body = { error: 'Студент не найден' };
    return;
  }

  const { name, group, course } = ctx.request.body || {};

  if (name) student.name = name;
  if (group) student.group = group;
  if (course !== undefined) {
    if (typeof course !== 'number' || course < 1 || course > 4) {
      ctx.status = 400;
      ctx.body = { error: 'Поле course должно быть числом от 1 до 4' };
      return;
    }
    student.course = course;
  }

  ctx.body = student;
});

router.delete('/students/:id', (ctx) => {
  const id = parseInt(ctx.params.id, 10);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    ctx.status = 404;
    ctx.body = { error: 'Студент не найден' };
    return;
  }

  const deleted = students.splice(index, 1)[0];
  ctx.body = { message: 'Студент удален', student: deleted };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Students API запущен на http://localhost:${PORT}`);
  console.log(`Попробуйте: http://localhost:${PORT}/students`);
});