const fs = require('fs').promises;
const path = require('path');

const VARIANT = 1;
const FILENAME = `student_${VARIANT}.txt`;

const fio = 'Кугач Надежда Алексеевна';
const group = '477';

const books = [
  '1. "Война и мир" - Л. Толстой',
  '2. "Преступление и наказание" - Ф. Достоевский',
  '3. "Мастер и Маргарита" - М. Булгаков',
  '4. "1984" - Дж. Оруэлл',
  '5. "Гарри Поттер" - Дж. Роулинг'
];

async function main() {
  try {
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').slice(0, 19);

    const lines = [
      `Студент: ${fio}`,
      `Группа: ${group}`,
      `Вариант: ${VARIANT}`,
      `Дата: ${dateStr}`,
      '',
      'Любимые книги:',
      ...books
    ];

    const filePath = path.join(__dirname, FILENAME);

    await fs.writeFile(filePath, lines.join('\n'), 'utf8');
    console.log(`Создан файл: ${FILENAME}`);

    const content = await fs.readFile(filePath, 'utf8');
    const totalLines = content.split('\n').length;

    const finalContent = content + `\n\nКоличество записей: ${totalLines}`;
    await fs.writeFile(filePath, finalContent, 'utf8');

    const finalRead = await fs.readFile(filePath, 'utf8');
    console.log('\nСодержимое файла:\n');
    console.log(finalRead);
  } catch (err) {
    console.error('Ошибка:', err.message);
  }
}

main();