const fs = require('fs');
const { pipeline, Transform } = require('stream');

fs.writeFileSync('input.txt', 'Тестовый файл для потоков Нади!');

console.log('=== Демонстрация pipe() ===');
console.log('Чтение: input.txt');
console.log('Запись: output-pipe.txt');

const r1 = fs.createReadStream('input.txt');
const w1 = fs.createWriteStream('output-pipe.txt');
r1.pipe(w1);

w1.on('finish', () => {
    console.log('✔ Копирование завершено');
    console.log('Размер: ' + fs.statSync('output-pipe.txt').size + ' байт\n');

    console.log('=== Демонстрация pipe() с ошибкой ===');
    console.log('Чтение: missing.txt');
    const r2 = fs.createReadStream('missing.txt');
    const w2 = fs.createWriteStream('output-bad.txt');
    r2.on('error', (e) => {
        console.error('✖ Ошибка: ' + e.message);
        console.log('△ Внимание: pipe() не закрыл целевой поток!\n');
        runPipeline();
    });
    r2.pipe(w2);
});

function runPipeline() {
    console.log('=== Демонстрация pipeline() ===');
    console.log('Чтение: input.txt');
    console.log('Запись: output-pipeline.txt');

    pipeline(
        fs.createReadStream('input.txt'),
        fs.createWriteStream('output-pipeline.txt'),
        (err) => {
            if (err) { console.error(err.message); return; }
            console.log('✔ Копирование завершено\n');
            runPipelineError();
        }
    );
}

function runPipelineError() {
    console.log('=== Демонстрация pipeline() с ошибкой ===');
    console.log('Чтение: missing.txt');
    pipeline(
        fs.createReadStream('missing.txt'),
        fs.createWriteStream('output-bad-pipeline.txt'),
        (err) => {
            if (err) {
                console.error('✖ Ошибка: ' + err.message);
                console.log('✔ Все потоки автоматически закрыты');
                console.log('✔ Утечек нет\n');
                runChain();
            }
        }
    );
}

function runChain() {
    console.log('=== Цепочка потоков ===');
    console.log('input.txt → upper → reverse → output-chain.txt');

    const up = new Transform({
        transform(chunk, enc, cb) {
            cb(null, chunk.toString().toUpperCase());
        }
    });

    const rev = new Transform({
        transform(chunk, enc, cb) {
            cb(null, chunk.toString().split('').reverse().join(''));
        }
    });

    pipeline(
        fs.createReadStream('input.txt'),
        up,
        rev,
        fs.createWriteStream('output-chain.txt'),
        (err) => {
            if (err) { console.error(err.message); return; }
            console.log('\n Обработка завершена');
            console.log('Содержимое output-chain.txt:');
            console.log(fs.readFileSync('output-chain.txt', 'utf8'));
        }
    );
}