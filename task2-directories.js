const fs = require('fs').promises;
const path = require('path');

const VARIANT = 1;
const PROJECT_DIR = `project_${VARIANT}`;

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function printTree(dirPath, prefix = '') {
  const items = await fs.readdir(dirPath);
  items.sort();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemPath = path.join(dirPath, item);
    const stat = await fs.stat(itemPath);
    const isLast = i === items.length - 1;
    const connector = isLast ? '└── ' : '├── ';

    console.log(prefix + connector + item);

    if (stat.isDirectory()) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      await printTree(itemPath, newPrefix);
    }
  }
}

async function main() {
  try {
    await ensureDir(PROJECT_DIR);

    const srcDir = path.join(PROJECT_DIR, 'src');
    const dataDir = path.join(PROJECT_DIR, 'data');

    await ensureDir(srcDir);
    await ensureDir(path.join(srcDir, 'modules'));
    await ensureDir(path.join(srcDir, 'components'));
    await ensureDir(path.join(srcDir, 'utils'));
    await ensureDir(dataDir);
    await ensureDir(path.join(dataDir, 'input'));
    await ensureDir(path.join(dataDir, 'output'));
    await ensureDir(path.join(dataDir, 'temp'));

    const allFolders = [
      'src',
      'src/modules',
      'src/components',
      'src/utils',
      'data',
      'data/input',
      'data/output',
      'data/temp'
    ];

    for (const folder of allFolders) {
      const infoPath = path.join(PROJECT_DIR, folder, 'info.txt');
      await fs.writeFile(infoPath, `Назначение папки: ${folder}`, 'utf8');
    }

    console.log('=== Дерево ДО изменений ===\n');
    console.log(PROJECT_DIR);
    await printTree(PROJECT_DIR);

    const componentsDir = path.join(srcDir, 'components');
    for (const n of ['1', '2', '3']) {
      await ensureDir(path.join(componentsDir, n));
    }
    console.log('\n[+] Добавлены папки 1, 2, 3 в src/components');

    const tempInData = path.join(dataDir, 'temp');
    const tempBackup = path.join(dataDir, 'temp_backup');
    await fs.rename(tempInData, tempBackup);
    console.log('[>] Папка temp временно переименована');

    const outputDir = path.join(dataDir, 'output');
    const resultsDir = path.join(dataDir, 'results');
    await fs.rename(outputDir, resultsDir);
    console.log('[R] Папка data/output переименована в data/results');

    await fs.rm(tempBackup, { recursive: true, force: true });
    console.log('[X] Папка temp удалена со всем содержимым');

    console.log('\n=== Дерево ПОСЛЕ изменений ===\n');
    console.log(PROJECT_DIR);
    await printTree(PROJECT_DIR);
  } catch (err) {
    console.error('Ошибка:', err.message);
  }
}

main();