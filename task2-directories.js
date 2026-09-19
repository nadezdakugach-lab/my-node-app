const fs = require('fs').promises;
const path = require('path');

const VARIANT = 1;
const PROJECT_DIR = `project_${VARIANT}`;

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function createInfoFiles(baseDir, folders) {
  for (const folder of folders) {
    const infoPath = path.join(baseDir, folder, 'info.txt');
    await fs.writeFile(infoPath, `Назначение папки: ${folder}`, 'utf8');
  }
}

async function printTree(dirPath, prefix = '', isLast = true) {
  const items = await fs.readdir(dirPath);
  items.sort();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemPath = path.join(dirPath, item);
    const stat = await fs.stat(itemPath);
    const isLastItem = i === items.length - 1;
    const connector = isLastItem ? '└── ' : '├── ';

    console.log(prefix + connector + item);

    if (stat.isDirectory()) {
      const newPrefix = prefix + (isLastItem ? '    ' : '│   ');
      await printTree(itemPath, newPrefix, isLastItem);
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
    console.log('\nДобавлены папки 1, 2, 3 в src/components');

    
    const tempDir = path.join(dataDir, 'temp');
    const newTempDir = path.join(dataDir, 'temp_moved');

    const tempPath = path.join(dataDir, 'temp');
    const movedTempPath = path.join(dataDir, 'output', 'temp');
    await fs.rename(tempPath, movedTempPath);
    console.log('Папка temp перемещена в data/output');


    const outputDir = path.join(dataDir, 'output');
    const resultsDir = path.join(dataDir, 'results');
    await fs.rename(outputDir, resultsDir);
    console.log('Папка data/output переименована в data/results');

   
    await fs.rm(path.join(resultsDir, 'temp'), { recursive: true, force: true });
    console.log('Папка temp удалена');

    console.log('\n=== Дерево ПОСЛЕ изменений ===\n');
    console.log(PROJECT_DIR);
    await printTree(PROJECT_DIR);
  } catch (err) {
    console.error('Ошибка:', err.message);
  }
}

main();