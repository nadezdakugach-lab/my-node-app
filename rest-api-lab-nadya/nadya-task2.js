require('dotenv').config();
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const { MongoClient } = require('mongodb');
const User = require('./models/user');
const UserService = require('./services/userService');
const UserController = require('./controllers/userController');
const errorHandler = require('./middleware/errorHandler');

const app = new Koa();
const router = new Router();
const client = new MongoClient(process.env.MONGO_URI);

let db;

async function init() {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    
    const userModel = new User(db);
    const userService = new UserService(userModel);
    const userController = new UserController(userService);

    app.use(errorHandler);
    app.use(bodyParser());
    
    app.use(async (ctx, next) => {
        ctx.set('X-Group', 'BBMO-01-23');
        await next();
    });

    router.get('/api/users', userController.getAll.bind(userController));
    router.get('/api/users/:id', userController.getById.bind(userController));
    router.post('/api/users', userController.create.bind(userController));
    router.put('/api/users/:id', userController.update.bind(userController));
    router.delete('/api/users/:id', userController.delete.bind(userController));

    app.use(router.routes());
    app.use(router.allowedMethods());

    app.listen(process.env.PORT, () => {
        console.log(`MVC Сервер запущен на порту ${process.env.PORT}`);
    });
}

init();