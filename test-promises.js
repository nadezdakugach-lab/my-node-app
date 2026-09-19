const FileManagerPromises = require('./fileOperationsPromises');

async function testFileOperations() {
  const fileManager = new FileManagerPromises('./test-data-promises');

  console.log('== ТЕСТИРОВАНИЕ ПРОМИСОВ ===\n');

  try {
    await fileManager.init();

    console.log('1. Создание файлов...');
    const file1 = await fileManager.createFile('file1.txt', 'Первый файл');
    const file2 = await fileManager.createFile('file2.txt', 'Второй файл');
    console.log(`  Создан: ${file1}`);
    console.log(`  Создан: ${file2}`);

    console.log('\n2. Чтение файла...');
    const content = await fileManager.readFile('file1.txt');
    console.log(`  Содержимое file1.txt: "${content}"`);

    console.log('\n3. Статистика...');
    const stats = await fileManager.getFileStats('file1.txt');
    console.log(`  Размер: ${stats.size} байт`);
    console.log(`  Создан: ${stats.created}`);
    console.log(`  Изменён: ${stats.modified}`);

    console.log('\n4. Список файлов...');
    const files = await fileManager.listFiles();
    files.forEach((f) => console.log(`  - ${f}`));

    console.log('\n5. Создание нескольких файлов параллельно...');
    const fileList = ['a.txt', 'b.txt', 'c.txt'];
    await fileManager.createMultipleFiles([
      { filename: 'a.txt', content: 'А' },
      { filename: 'b.txt', content: 'Б' },
      { filename: 'c.txt', content: 'В' }
    ]);
    console.log('  Созданы: a.txt, b.txt, c.txt');

    console.log('\n6. Чтение нескольких файлов параллельно...');
    const contents = await fileManager.readMultipleFiles(fileList);
    console.log('  Содержимое файлов:');
    Object.entries(contents).forEach(([filename, content]) => {
      console.log(`  - ${filename}: "${content}"`);
    });

    console.log('\n7. Очистка...');
    const allFiles = await fileManager.listFiles();
    for (const file of allFiles) {
      await fileManager.deleteFile(file);
      console.log(`  ${file} удалён`);
    }

    console.log('\nВсе операции завершены!');
    console.log('Код стал намного чище и читаемее!');
  } catch (error) {
    console.error('\nОшибка:', error.message);
    console.error('Stack:', error.stack);
  }
}

testFileOperations();