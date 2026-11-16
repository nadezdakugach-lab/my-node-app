const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Использование: node nadya-task1.js <команда> [аргументы]');
    console.log('Доступные команды:');
    console.log('  greet <имя> - поприветствовать пользователя');
    console.log('  info - вывести информацию о группе');
    process.exit(0);
}

const cmd = args[0];

if (cmd === 'greet') {
    const name = args[1];
    if (!name) {
        console.error('Ошибка: укажите имя');
        process.exit(1);
    }
    console.log('Привет, ' + name + '! Добро пожаловать в CLI-приложение группы 477.');
    process.exit(0);
} else if (cmd === 'info') {
    console.log('Группа: 477');
    console.log('Студент: Кугач Надежда');
    console.log('Лабораторная работа: №17');
    console.log('Дата: ' + new Date().toLocaleString('ru-RU'));
    process.exit(0);
} else if (cmd === '--help') {
    console.log('Использование: node nadya-task1.js <команда> [аргументы]');
    console.log('Доступные команды:');
    console.log('  greet <имя> - поприветствовать пользователя');
    console.log('  info - вывести информацию о группе');
    process.exit(0);
} else {
    console.error('Ошибка: неизвестная команда "' + cmd + '"');
    console.error('Для справки используйте: node nadya-task1.js --help');
    process.exit(1);
}