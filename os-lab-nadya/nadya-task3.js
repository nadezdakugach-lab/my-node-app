const os = require('os');

function maskMac(mac) {
    if (!mac || mac === '00:00:00:00:00:00') return 'скрыт';
    const parts = mac.split(':');
    return parts.slice(0, 3).join(':') + ':**:**';
}

console.log('=== Сетевые интерфейсы ===');
const nets = os.networkInterfaces();
let mainIf = null;
let count = 0;

for (const name in nets) {
    for (const addr of nets[name]) {
        count++;
        console.log('\nИнтерфейс: ' + name);
        console.log('  IPv4: ' + addr.address);
        console.log('  MAC: ' + maskMac(addr.mac));
        console.log('  Внутренний: ' + (addr.internal ? 'да' : 'нет'));
        if (!addr.internal && addr.family === 'IPv4' && !mainIf) {
            mainIf = { name, address: addr.address };
        }
    }
}

console.log('\nВсего интерфейсов: ' + count);
if (mainIf) {
    console.log('Основной интерфейс: ' + mainIf.name + ' (' + mainIf.address + ')');
}

const user = os.userInfo();
console.log('\n=== Информация о пользователе ===');
console.log('Имя пользователя: ' + user.username);
console.log('UID: ' + (user.uid !== undefined ? user.uid : 'N/A (Windows)'));
console.log('GID: ' + (user.gid !== undefined ? user.gid : 'N/A (Windows)'));
console.log('Домашняя директория: ' + os.homedir());
console.log('Оболочка: ' + (user.shell || 'N/A'));

console.log('\nГруппа: 477');
const isRoot = user.username === 'root' || user.uid === 0;
console.log('Проверка root: ' + (isRoot ? 'ДА' : 'нет'));