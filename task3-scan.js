const fs = require('fs').promises;
const path = require('path');

const VARIANT = 1;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const IGNORE_PATTERNS = ['node_modules', '.git'];

async function scanDirectory(dirPath, stats, baseDir) {
  const items = await fs.readdir(dirPath);

  for (const item of items) {
    if (IGNORE_PATTERNS.includes(item)) continue;

    const fullPath = path.join(dirPath, item);
    let stat;

    try {
      stat = await fs.stat(fullPath);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      stats.folders++;
      await scanDirectory(fullPath, stats, baseDir);
    } else if (stat.isFile()) {
      if (stat.size > MAX_FILE_SIZE) continue;

      stats.files++;
      stats.totalSize += stat.size;

      const ext = path.extname(item) || '(без расширения)';
      if (!stats.byExt[ext]) {
        stats.byExt[ext] = { count: 0, size: 0 };
      }
      stats.byExt[ext].count++;
      stats.byExt[ext].size += stat.size;

      stats.fileList.push({
        name: item,
        path: path.relative(baseDir, fullPath),
        size: stat.size
      });
    }
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(2)} МБ`;
}

async function main() {
  const targetDir = process.argv[2] || '.';
  const absoluteDir = path.resolve(targetDir);

  console.log(`Анализ директории: ${targetDir}\n`);

  const stats = {
    files: 0,
    folders: 0,
    totalSize: 0,
    byExt: {},
    fileList: []
  };

  try {
    await scanDirectory(absoluteDir, stats, absoluteDir);
  } catch (err) {
    console.error('Ошибка сканирования:', err.message);
    return;
  }

  console.log(`Общее количество папок: ${stats.folders}`);
  console.log(`Общее количество файлов: ${stats.files}`);
  console.log(`Общий размер: ${formatSize(stats.totalSize)} (${stats.totalSize} байт)`);

  console.log('\nРасширения файлов:');
  const sortedExt = Object.entries(stats.byExt).sort(
    (a, b) => b[1].size - a[1].size
  );
  for (const [ext, data] of sortedExt) {
    console.log(`  ${ext}: ${data.count} файлов (${formatSize(data.size)})`);
  }

  const sorted = [...stats.fileList].sort((a, b) => b.size - a.size);

  console.log('\nТоп-5 самых больших файлов:');
  sorted.slice(0, 5).forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.name} (${formatSize(f.size)}) - ${f.path}`);
  });

  console.log('\nТоп-5 самых маленьких файлов:');
  sorted.slice(-5).reverse().forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.name} (${formatSize(f.size)}) - ${f.path}`);
  });

  const report = {
    directory: targetDir,
    scanDate: new Date().toISOString(),
    totalFiles: stats.files,
    totalFolders: stats.folders,
    totalSizeBytes: stats.totalSize,
    totalSizeFormatted: formatSize(stats.totalSize),
    byExtension: stats.byExt,
    top5Largest: sorted.slice(0, 5),
    top5Smallest: sorted.slice(-5).reverse()
  };

  const reportFile = `report_${VARIANT}.json`;
  await fs.writeFile(
    path.join(process.cwd(), reportFile),
    JSON.stringify(report, null, 2),
    'utf8'
  );

  console.log(`\nОтчет сохранен: ${reportFile}`);
}

main();