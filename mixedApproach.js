const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const statAsync = promisify(fs.stat);
const unlinkAsync = promisify(fs.unlink);
const readdirAsync = promisify(fs.readdir);
const mkdirAsync = promisify(fs.mkdir);

class MixedFileManager {
  constructor(baseDir = './mixed-data') {
    this.baseDir = baseDir;
  }

  async init() {
    try {
      await mkdirAsync(this.baseDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
  }

  createFile(filename, content) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.baseDir, filename);
      fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) return reject(err);
        resolve(filePath);
      });
    });
  }

  readFile(filename) {
    const filePath = path.join(this.baseDir, filename);
    return readFileAsync(filePath, 'utf8');
  }

  async getFileStats(filename) {
    const filePath = path.join(this.baseDir, filename);
    const stats = await statAsync(filePath);
    return {
      size: stats.size,
      isFile: stats.isFile()
    };
  }

  async listFiles() {
    const files = await readdirAsync(this.baseDir);
    const results = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(this.baseDir, file);
        try {
          const stats = await statAsync(filePath);
          return { name: file, isFile: stats.isFile() };
        } catch {
          return { name: file, isFile: false };
        }
      })
    );
    return results.filter((r) => r.isFile).map((r) => r.name);
  }

  async deleteFile(filename) {
    const filePath = path.join(this.baseDir, filename);
    try {
      await unlinkAsync(filePath);
      return true;
    } catch (err) {
      console.error(`  Не удалось удалить ${filename}:`, err.message);
      return false;
    }
  }
}

async function demo() {
  console.log('== СМЕШАННЫЙ ПОДХОД (callbacks + promises) ===\n');

  const manager = new MixedFileManager('./mixed-data');
  await manager.init();

  console.log('1. Создание файлов...');
  await manager.createFile('mixed1.txt', 'Смешанный подход 1');
  await manager.createFile('mixed2.txt', 'Смешанный подход 2');
  console.log('  Файлы созданы');

  console.log('\n2. Чтение через promisify...');
  const content = await manager.readFile('mixed1.txt');
  console.log(`  Содержимое: "${content}"`);

  console.log('\n3. Статистика...');
  const stats = await manager.getFileStats('mixed1.txt');
  console.log(`  Размер: ${stats.size} байт`);

  console.log('\n4. Список файлов...');
  const files = await manager.listFiles();
  files.forEach((f) => console.log(`  - ${f}`));

  console.log('\n5. Очистка...');
  for (const file of files) {
    const ok = await manager.deleteFile(file);
    if (ok) console.log(`  ${file} удалён`);
  }

  console.log('\nГотово! Все три подхода (колбэки, промисы, смешанный) продемонстрированы.');
}

demo().catch((err) => {
  console.error('Критическая ошибка:', err);
  process.exit(1);
});