const { EventEmitter } = require('events');
const bus = new EventEmitter();

bus.on('greet', (name) => {
    console.log('[greet] Привет, ' + name + '!');
});

bus.on('info', () => {
    console.log('[info] Группа: 477');
});

bus.on('bye', () => {
    console.log('[bye] До свидания!');
});

console.log('=== Демонстрация EventEmitter ===');

bus.emit('greet', 'Надя');
bus.emit('info');
bus.emit('bye');

const r1 = bus.emit('unknown');
console.log('Событие "unknown" без слушателей: ' + r1);

const r2 = bus.emit('greet', 'Надя');
console.log('Событие "greet" со слушателями: ' + r2);