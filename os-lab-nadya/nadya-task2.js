const os = require('os');

const cpus = os.cpus();
const cores = cpus.length;
const model = cpus[0].model;
let totalSpeed = 0;
cpus.forEach(c => totalSpeed += c.speed);
const avgSpeed = Math.round(totalSpeed / cores);

console.log('=== Информация о процессоре ===');
console.log('Количество логических ядер: ' + cores);
console.log('Модель процессора: ' + model);
console.log('Средняя частота: ' + avgSpeed + ' МГц');

const totalMem = os.totalmem();
const freeMem = os.freemem();
const usedMem = totalMem - freeMem;
const totalGb = (totalMem / 1073741824).toFixed(2);
const freeGb = (freeMem / 1073741824).toFixed(2);
const usedPct = ((usedMem / totalMem) * 100).toFixed(1);

console.log('\n=== Информация о памяти ===');
console.log('Общий объём: ' + totalGb + ' ГБ');
console.log('Свободно: ' + freeGb + ' ГБ');
console.log('Использовано: ' + usedPct + '%');

const load = os.loadavg();
console.log('\n=== Средняя загрузка ===');
if (os.platform() === 'win32') {
    console.log('Для Windows средняя загрузка недоступна');
} else {
    console.log('1 мин: ' + load[0].toFixed(2));
    console.log('5 мин: ' + load[1].toFixed(2));
    console.log('15 мин: ' + load[2].toFixed(2));
}

console.log('\nГруппа: 477');
const freePct = (freeMem / totalMem) * 100;
if (freePct < 20) {
    console.log('ВНИМАНИЕ: Мало свободной памяти!');
} else {
    console.log('Память в норме');
}