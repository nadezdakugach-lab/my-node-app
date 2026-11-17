const os = require('os');

const p = os.platform();
const t = os.type();
const a = os.arch();
const r = os.release();
const h = os.hostname();
const u = os.uptime();

const hours = Math.floor(u / 3600);
const mins = Math.floor((u % 3600) / 60);
const secs = Math.floor(u % 60);

console.log('=== Информация о системе (группа 477) ===');
console.log('Платформа: ' + p);
console.log('Тип ОС: ' + t);
console.log('Архитектура: ' + a);
console.log('Версия ОС: ' + r);
console.log('Имя хоста: ' + h);
console.log('Время работы: ' + hours + ' ч ' + mins + ' мин ' + secs + ' сек');

if (p === 'win32') {
    console.log('Вы работаете в Windows');
} else if (p === 'linux') {
    console.log('Вы работаете в Linux');
} else if (p === 'darwin') {
    console.log('Вы работаете в macOS');
} else {
    console.log('Неизвестная платформа');
}
