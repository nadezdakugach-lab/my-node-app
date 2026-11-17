const { Writable } = require('stream');

const data = [
    'Группа: 477',
    'Студент: Кугач Надежда',
    'Лабораторная работа: №21',
    'Тема: Потоки в Node.js'
];

let written = 0;

const out = new Writable({
    highWaterMark: 16,
    write(chunk, enc, cb) {
        console.log('[WRITE] ' + chunk.toString());
        setTimeout(() => {
            written++;
            cb();
        }, 100);
    }
});

console.log('=== Демонстрация Writable-потока ===');

out.on('drain', () => {
    console.log('[DRAIN] Буфер освобождён, продолжаем запись');
});

out.on('finish', () => {
    console.log('[FINISH] Все данные записаны');
    console.log('Всего записано: ' + written + ' чанка');
});

for (let i = 0; i < data.length; i++) {
    const ok = out.write(data[i]);
    console.log('write() вернул: ' + ok + (ok ? '' : ' (буфер переполнен)'));
}

out.end();