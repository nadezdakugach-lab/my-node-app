require('dotenv').config();
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser'); // Добавлено
const { MongoClient } = require('mongodb');

const app = new Koa();
const router = new Router();
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(uri);

let db;

async function connectDB() {
    await client.connect();
    db = client.db(dbName);
    console.log(' MongoDB подключена');
}


app.use(async (ctx, next) => {
    ctx.set('X-Group', 'BBMO-01-23');
    await next();
});


app.use(bodyParser());

router.get('/api/users', async (ctx) => {
    const users = await db.collection('users').find({}).toArray();
    ctx.body = { data: users };
});

router.get('/api/users/:id', async (ctx) => {
    const { ObjectId } = require('mongodb');
    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(ctx.params.id) });
        if (!user) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
            return;
        }
        ctx.body = { data: user };
    } catch (e) {
        ctx.status = 400;
        ctx.body = { error: 'Invalid ID format' };
    }
});

router.post('/api/users', async (ctx) => {
    const { name, email, group_name, age } = ctx.request.body;
    
    if (!name || !email || !group_name || !age) {
        ctx.status = 400;
        ctx.body = { error: 'Validation failed', details: 'All fields are required' };
        return;
    }

    const result = await db.collection('users').insertOne({
        name, email, group_name, age: Number(age), created_at: new Date()
    });
    
    ctx.status = 201;
    ctx.body = { data: { _id: result.insertedId, name, email, group_name, age } };
});

router.put('/api/users/:id', async (ctx) => {
    const { ObjectId } = require('mongodb');
    const { name, email, group_name, age } = ctx.request.body;
    
    const result = await db.collection('users').updateOne(
        { _id: new ObjectId(ctx.params.id) },
        { $set: { name, email, group_name, age: Number(age) } }
    );

    if (result.matchedCount === 0) {
        ctx.status = 404;
        ctx.body = { error: 'User not found' };
    } else {
        ctx.body = { message: 'Updated', modifiedCount: result.modifiedCount };
    }
});

router.delete('/api/users/:id', async (ctx) => {
    const { ObjectId } = require('mongodb');
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(ctx.params.id) });
    
    if (result.deletedCount === 0) {
        ctx.status = 404;
        ctx.body = { error: 'User not found' };
    } else {
        ctx.body = { message: 'Deleted' };
    }
});

app.use(router.routes());
app.use(router.allowedMethods());

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Сервер запущен на порту ${process.env.PORT}`);
    });
});