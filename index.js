const http = require('http');
const EventEmitter = require('events');
const logger = require('./logger');


class AppServer extends EventEmitter {
  constructor() {
    super();
    this.server = null;
    this.port = null;
  }

  start(port) {
    this.port = port;

    this.server = http.createServer((req, res) => {
      this.emit('request:received', { url: req.url, method: req.method });

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>Hello from Event-Driven Server!</h1>');
    });

    this.server.listen(port, () => {
      this.emit('server:started', port);
    });
  }

  stop() {
    if (this.server) {
      this.server.close(() => {
        this.emit('server:stopped');
      });
    }
  }
}

class OrderHandler extends EventEmitter {
  processOrder(orderId) {
    this.emit('order:start', orderId);

    setTimeout(() => {
      this.emit('order:processing', orderId);

      setTimeout(() => {
        const sum = Math.floor(Math.random() * 901) + 100;
        this.emit('order:complete', orderId, sum);
      }, 2000);
    }, 2000);
  }
}

function calculatePi() {
  function arctg(x, terms) {
    let sum = 0;
    let term = x;
    const xSquared = x * x;
    let sign = 1;
    for (let i = 0; i < terms; i++) {
      sum += sign * term / (2 * i + 1);
      term *= xSquared;
      sign = -sign;
    }
    return sum;
  }
  const pi = 16 * arctg(1 / 5, 40) - 4 * arctg(1 / 239, 30);
  return pi.toFixed(7);
}

class UserTracker extends EventEmitter {
  trackAction(userId, action, metadata) {
    const event = {
      userId: userId,
      action: action,
      timestamp: new Date().toISOString(),
      metadata: metadata,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.emit('user:action', event);
  }
}


const app = new AppServer();
logger.setupLogger(app);

app.on('server:started', (port) => {
  console.log(`Сервер запущен на порту ${port}`);
});

app.on('request:received', (req) => {
  console.log(`Получен запрос: ${req.method} ${req.url}`);
});

app.on('server:stopped', () => {
  console.log('Сервер остановлен');
});

const orderHandler = new OrderHandler();

orderHandler.on('order:start', (orderId) => {
  console.log(`[order:start] Заказ #${orderId} начат`);
});

orderHandler.on('order:processing', (orderId) => {
  console.log(`[order:processing] Заказ #${orderId}: Идёт обработка...`);
});

orderHandler.on('order:complete', (orderId, sum) => {
  const pi = calculatePi();
  console.log(`[order:complete] Заказ #${orderId} завершён на сумму ${sum} руб. PI = ${pi}`);
});

app.on('request:received', (req) => {
  const match = req.url.match(/^\/order\/(.+)$/);
  if (match && req.method === 'GET') {
    const orderId = match[1];
    setTimeout(() => orderHandler.processOrder(orderId), 100);
  }
});

const tracker = new UserTracker();

tracker.on('user:action', (event) => {
  console.log('╔══════════════════════════════════════════╗');
  console.log(`║ Пользователь ${event.userId} совершил действие "${event.action}"`);
  console.log(`║ Время: ${event.timestamp}`);
  console.log(`║ ID события: ${event.id}`);
  console.log(`║ Доп. данные: ${JSON.stringify(event.metadata)}`);
  console.log('╚══════════════════════════════════════════╝');
});

tracker.trackAction('user-1', 'login', { ip: '192.168.1.1', browser: 'Chrome' });
tracker.trackAction('user-2', 'purchase', { item: 'Book', price: 500 });
tracker.trackAction('user-3', 'logout', { duration: 3600 });

app.start(3000);

setTimeout(() => {
  app.stop();
}, 30000);