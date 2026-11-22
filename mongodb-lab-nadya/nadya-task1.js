require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(uri);

async function run() {
    try {
        console.log('=== Подключение к MongoDB ===');
        await client.connect();
        console.log(' Подключение установлено');

        const db = client.db(dbName);
        const adminDb = client.db('admin');

       
        const buildInfo = await adminDb.command({ buildInfo: 1 });
        console.log('Версия MongoDB: ' + buildInfo.version);
        console.log('База данных: ' + dbName);

     
        const listDatabases = await adminDb.admin().listDatabases();
        console.log('\nСписок БД:');
        listDatabases.databases.forEach(d => console.log('- ' + d.name));

      
        const collections = await db.listCollections().toArray();
        console.log('\nКоллекции в ' + dbName + ':');
        if (collections.length === 0) {
            console.log('(пусто — БД создана лениво)');
        } else {
            collections.forEach(c => console.log('- ' + c.name));
        }

        console.log('\n Соединение стабильно');
    } catch (e) {
        console.error(' Ошибка подключения: ' + e.message);
    } finally {
        await client.close();
        console.log(' Соединение закрыто');
    }
}

run();