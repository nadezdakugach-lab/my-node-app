const { EventEmitter } = require('events');
const ev = new EventEmitter();

let onCount = 0;
let onceCount = 0;

ev.on('tick', () => {
    onCount++;
    console.log('[tick #' + onCount + '] on-слушатель');
});

ev.once('tick', () => {
    onceCount++;
    console.log('[tick #' + onceCount + '] once-слушатель');
});

ev.emit('tick');
ev.emit('tick');
ev.emit('tick');

console.log('\non-слушатель вызван: ' + onCount + ' раза');
console.log('once-слушатель вызван: ' + onceCount + ' раз');

console.log('\n=== Управление подписками ===');
console.log('Слушателей до удаления: ' + ev.listenerCount('tick'));

function temp() {
    console.log('temp');
}
ev.on('check', temp);
ev.on('check', () => console.log('check2'));
ev.on('check', () => console.log('check3'));

console.log('Слушателей check: ' + ev.listenerCount('check'));
ev.removeListener('check', temp);
console.log('После removeListener: ' + ev.listenerCount('check'));
ev.removeAllListeners('check');
console.log('После removeAllListeners: ' + ev.listenerCount('check'));

console.log('\n=== Порядок вызова ===');
ev.on('order', () => console.log('1. Первый слушатель (группа 477)'));
ev.on('order', () => console.log('2. Второй слушатель'));
ev.on('order', () => console.log('3. Третий слушатель'));
ev.emit('order');