const { Readable } = require('stream');

const chunks = [
    'Группа: 477',
    'Студент: Кугач Надежда',
    'Лабораторная работа: №21',
    'Тема: Потоки в Node.js'
];

let index = 0;

const src = new Readable({
    read() {
        if (index < chunks.length) {
            this.push(chunks[index]);
            index++;
        } else {
            this.push(null);
        }
    }
});

let count = 0;

console.log('=== Демонстрация Readable-потока ===');

src.on('data', (chunk) => {
    count++;
    console.log('[CHUNK ' + count + '] ' + chunk.toString());
});

src.on('end', () => {
    console.log('[END] Поток завершён');
    console.log('Всего получено чанков: ' + count);
});

src.on('error', (err) => {
    console.error('Ошибка: ' + err.message);
});