require('dotenv').config();
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const { MongoClient } = require('mongodb');
const errorHandler = require('./middleware/errorHandler');

const app = new Koa();
const router = new Router();
const client = new MongoClient(process.env.MONGO_URI);

let db;

async function init() {
    await client.connect();
    db = client.db(process.env.DB_NAME);

    app.use(errorHandler);
    app.use(bodyParser());
    
    app.use(async (ctx, next) => {
        ctx.set('X-Group', 'BBMO-01-23');
        await next();
    });

    
    router.get('/api/users', async (ctx) => {
        const { page = 1, limit = 10, sort = 'name', order = 'asc', group_name, age_min, age_max } = ctx.query;
        
        const filter = {};
        if (group_name) filter.group_name = group_name;
        if (age_min || age_max) {
            filter.age = {};
            if (age_min) filter.age.$gte = Number(age_min);
            if (age_max) filter.age.$lte = Number(age_max);
        }

        const sortObj = {};
        sortObj[sort] = order === 'desc' ? -1 : 1;

        const skip = (Number(page) - 1) * Number(limit);
        const collection = db.collection('users');

        const [users, total] = await Promise.all([
            collection.find(filter).sort(sortObj).skip(skip).limit(Number(limit)).toArray(),
            collection.countDocuments(filter)
        ]);

        ctx.body = {
            data: users,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            }
        };
    });

 
    router.get('/api/users/stats', async (ctx) => {
        const stats = await db.collection('users').aggregate([
            {
                $group: {
                    _id: '$group_name',
                    count: { $sum: 1 },
                    avgAge: { $avg: '$age' }
                }
            }
        ]).toArray();

        ctx.body = { data: stats };
    });

  
    router.get('/api/users/search', async (ctx) => {
        const { q } = ctx.query;
        if (!q) {
            ctx.status = 400;
            ctx.body = { error: 'Query parameter q is required' };
            return;
        }
        
     
        const users = await db.collection('users').find({
            name: { $regex: q, $options: 'i' }
        }).toArray();

        ctx.body = { found: users.length, data: users };
    });

    app.use(router.routes());
    app.use(router.allowedMethods());

    app.listen(process.env.PORT, () => {
        console.log(`Advanced API Server запущен на порту ${process.env.PORT}`);
    });
}

init();