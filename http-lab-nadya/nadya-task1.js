const http = require('http');

function log(method, path, code) {
    const t = new Date().toLocaleString('ru-RU');
    console.log('[' + t + '] ' + method + ' ' + path + ' ' + code);
}

const srv = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Лабораторная работа №20</h1><p>Группа: 477</p><p>Метод: ' + req.method + '</p><p>URL: ' + req.url + '</p>');
        log(req.method, req.url, 200);
    } else if (req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>О студенте</h1><p>Группа: 477</p><p>Студент: Кугач Надежда</p>');
        log(req.method, req.url, 200);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 Not Found</h1><p>Путь ' + req.url + ' не найден</p>');
        log(req.method, req.url, 404);
    }
});

srv.listen(3000, () => console.log('Сервер запущен на порту 3000'));