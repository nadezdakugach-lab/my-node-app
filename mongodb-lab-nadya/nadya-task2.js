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
        console.log('=== Коллекция students (группа ББМО-01-23) ===');


        console.log('\n--- INSERT ---');
        const r1 = await collection.insertOne({
            name: 'Надя',
            group_name: 'ББМО-01-23',
            course: 2,
            grade: 4.5,
            created_at: new Date()
        });
        console.log(' Вставлен: insertedId=' + r1.insertedId);

        const r2 = await collection.insertMany([
            { name: 'Иван', group_name: 'ББМО-01-23', course: 2, grade: 3.8 },
            { name: 'Петр', group_name: 'ББМО-01-23', course: 3, grade: 4.2 },
            { name: 'Мария', group_name: 'ББМО-02-23', course: 1, grade: 4.9 }
        ]);
        console.log(' Вставлено 3 документа: insertedIds=' + JSON.stringify(r2.insertedIds));

      
        console.log('\n--- SELECT ---');
        const all = await collection.find({}).toArray();
        console.log('Все документы (' + all.length + '):');
        all.forEach(s => console.log('  ' + s.name + ', группа: ' + s.group_name + ', оценка: ' + s.grade));

        const filtered = await collection.find({ group_name: 'ББМО-01-23' }).sort({ grade: -1 }).toArray();
        console.log('\nСтуденты ББМО-01-23 (по убыванию оценки):');
        filtered.forEach(s => console.log('  ' + s.name + ': ' + s.grade));

     
        const projection = await collection.find({}, { projection: { name: 1, grade: 1, _id: 0 } }).limit(2).toArray();
        console.log('\nПроекция (имя, оценка):');
        projection.forEach(s => console.log('  ' + s.name + ': ' + s.grade));

       
        console.log('\n--- UPDATE ---');
        const u1 = await collection.updateOne({ name: 'Надя' }, { $set: { grade: 5.0 } });
        console.log(' updateOne: matchedCount=' + u1.matchedCount + ', modifiedCount=' + u1.modifiedCount);

        const u2 = await collection.updateMany({ group_name: 'ББМО-01-23' }, { $inc: { course: 1 } });
        console.log(' updateMany (course+1): matchedCount=' + u2.matchedCount + ', modifiedCount=' + u2.modifiedCount);


        console.log('\n--- DELETE ---');
        const d1 = await collection.deleteOne({ name: 'Иван' });
        console.log(' deleteOne: deletedCount=' + d1.deletedCount);

        const d2 = await collection.deleteMany({ grade: { $lt: 4.0 } });
        console.log(' deleteMany (grade < 4.0): deletedCount=' + d2.deletedCount);

    } catch (e) {
        console.error('Ошибка:', e.message);
    } finally {
        await client.close();
    }
}

run();