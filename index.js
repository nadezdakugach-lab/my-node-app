const http = require('http');

function calculatePi(iterations) {
  let sum = 0;
  let sign = 1;
  for (let i = 0; i < iterations; i++) {
    sum += sign / (2 * i + 1);
    sign = -sign;
  }
  return (sum * 4).toFixed(2);
}

const fio = 'Кугач Надежда Алексеевна';
const group = '477';
const journalNumber = 12;

const pi = calculatePi(1000 + journalNumber * 100);

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <h1>Привет, мир!</h1>
    <h1>${fio}</h1>
    <h2>Группа: ${group}</h2>
    <h2>Число Пи: ${pi}</h2>
  `);
});

server.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});