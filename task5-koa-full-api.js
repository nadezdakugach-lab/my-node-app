const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();
const PORT = 3000;

app.use(bodyParser());

const FIRST_NAMES = ['Александр', 'Алексей', 'Анна', 'Андрей', 'Борис', 'Виктор', 'Галина', 'Дмитрий', 'Елена', 'Иван', 'Игорь', 'Ксения', 'Леонид', 'Мария', 'Николай', 'Ольга', 'Павел', 'Роман', 'Светлана', 'Татьяна'];
const LAST_NAMES = ['Иванов', 'Петров', 'Сидоров', 'Кузнецов', 'Смирнов', 'Попов', 'Соколов', 'Лебедев', 'Козлов', 'Новиков', 'Морозов', 'Волков', 'Алексеев', 'Егоров', 'Павлов'];
const GROUPS = ['ББМО-01-23', 'ББМО-02-23', 'ББМО-03-23', 'ББМО-04-23'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateStudents(count) {
  const students = [];
  for (let i = 1; i <= count; i++) {
    students.push({
      id: i,
      name: `${randomItem(LAST_NAMES)} ${randomItem(FIRST_NAMES)}`,
      group: randomItem(GROUPS),
      course: Math.floor(Math.random() * 4) + 1
    });
  }
  return students;
}

let students = generateStudents(50);
let nextId = 51;

router.get('/students', (ctx) => {
  const { limit = '10', offset = '0', sort, search, group } = ctx.query;

  let result = [...students];

  if (group) {
    result = result.filter((s) => s.group === group);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter((s) => s.name.toLowerCase().includes(q));
  }

  if (sort) {
    const desc = sort.startsWith('-');
    const field = desc ? sort.slice(1) : sort;
    if (['name', 'course', 'group', 'id'].includes(field)) {
      result.sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (av < bv) return desc ? 1 : -1;
        if (av > bv) return desc ? -1 : 1;
        return 0;
      });
    }
  }

  const total = result.length;
  const limitN = parseInt(limit, 10);
  const offsetN = parseInt(offset, 10);
  result = result.slice(offsetN, offsetN + limitN);

  ctx.body = {
    total,
    limit: limitN,
    offset: offsetN,
    count: result.length,
    data: result
  };
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
  if (!GROUPS.includes(group)) {
    ctx.status = 400;
    ctx.body = { error: 'Неизвестная группа' };
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
  if (group) {
    if (!GROUPS.includes(group)) {
      ctx.status = 400;
      ctx.body = { error: 'Неизвестная группа' };
      return;
    }
    student.group = group;
  }
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
  console.log(`Full API запущен на http://localhost:${PORT}`);
  console.log(`Сгенерировано студентов: ${students.length}`);
  console.log(`Примеры:`);
  console.log(`  http://localhost:${PORT}/students`);
  console.log(`  http://localhost:${PORT}/students?limit=5&offset=10`);
  console.log(`  http://localhost:${PORT}/students?sort=name&limit=5`);
  console.log(`  http://localhost:${PORT}/students?search=Алек`);
});