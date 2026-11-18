class UserController {
    constructor(service) {
        this.service = service;
    }

    async getAll(ctx) {
        const users = await this.service.getAll();
        ctx.body = { data: users };
    }

    async getById(ctx) {
        try {
            const user = await this.service.getById(ctx.params.id);
            if (!user) {
                ctx.status = 404;
                ctx.body = { error: 'User not found' };
            } else {
                ctx.body = { data: user };
            }
        } catch (e) {
            ctx.status = 400;
            ctx.body = { error: 'Invalid ID' };
        }
    }

    async create(ctx) {
        try {
            const user = await this.service.create(ctx.request.body);
            ctx.status = 201;
            ctx.body = { data: user };
        } catch (e) {
            ctx.status = 400;
            ctx.body = { error: 'Validation failed', details: e.details };
        }
    }

    async update(ctx) {
        try {
            const result = await this.service.update(ctx.params.id, ctx.request.body);
            if (result.matchedCount === 0) {
                ctx.status = 404;
                ctx.body = { error: 'User not found' };
            } else {
                ctx.body = { message: 'Updated' };
            }
        } catch (e) {
            ctx.status = 400;
            ctx.body = { error: 'Validation failed', details: e.details };
        }
    }

    async delete(ctx) {
        const result = await this.service.delete(ctx.params.id);
        if (result.deletedCount === 0) {
            ctx.status = 404;
            ctx.body = { error: 'User not found' };
        } else {
            ctx.body = { message: 'Deleted' };
        }
    }
}

module.exports = UserController;