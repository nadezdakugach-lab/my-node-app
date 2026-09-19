const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'logs.txt');

function writeLog(message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}\n`;

  fs.appendFile(LOG_FILE, line, 'utf8', (err) => {
    if (err) {
      console.error('Ошибка записи в лог:', err.message);
    }
  });
}

function setupLogger(app) {
  app.on('server:started', (port) => {
    writeLog(`СОБЫТИЕ: server:started | порт ${port}`);
  });

  app.on('server:stopped', () => {
    writeLog(`СОБЫТИЕ: server:stopped`);
  });

  app.on('request:received', (req) => {
    writeLog(`СОБЫТИЕ: request:received | ${req.method} ${req.url}`);
  });
}

module.exports = { setupLogger };