require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(uri);

async function run() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('students');

    try {
        console.log('=== Курсоры и Агрегации ===');

       
        console.log('\n--- Итерация через курсор ---');
        const cursor = collection.find({});
        let count = 0;
        for await (const doc of cursor) {
            count++;
           
        }
        console.log('Получено документов через курсор: ' + count);

    
        console.log('\n--- Агрегации ---');
        
       
        const avgGrade = await collection.aggregate([
            { $group: { _id: '$group_name', avgGrade: { $avg: '$grade' } } },
            { $sort: { avgGrade: -1 } }
        ]).toArray();
        
        console.log('Средний балл по группам:');
        avgGrade.forEach(g => console.log('  ' + g._id + ': ' + g.avgGrade.toFixed(2)));

       
        const byCourse = await collection.aggregate([
            { $group: { _id: '$course', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]).toArray();

        console.log('\nКоличество студентов по курсам:');
        byCourse.forEach(c => console.log('  ' + c._id + ' курс: ' + c.count));

    
        console.log('\n--- Индексы ---');
        
     
        const indexName = await collection.createIndex({ group_name: 1, grade: -1 });
        console.log(' Создан составной индекс: ' + indexName);

   
        const explainResult = await collection.find({ group_name: 'ББМО-01-23' })
            .sort({ grade: -1 })
            .explain('executionStats');
        
        console.log('Execution Stats (с индексом):');
        console.log('  executionTimeMillis: ' + explainResult.executionStats.executionTimeMillis + ' мс');
        console.log('  totalDocsExamined: ' + explainResult.executionStats.totalDocsExamined);

    } catch (e) {
        console.error('Ошибка:', e.message);
    } finally {
        await client.close();
    }
}

run();