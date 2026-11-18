const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    group_name: Joi.string().pattern(/^ББМО-\d{2}-\d{2}$/).required(),
    age: Joi.number().integer().min(16).max(100).required()
});

class UserService {
    constructor(userModel) {
        this.model = userModel;
    }

    validate(data) {
        const { error } = schema.validate(data);
        if (error) throw error;
    }

    async getAll() {
        return await this.model.findAll();
    }

    async getById(id) {
        return await this.model.findById(id);
    }

    async create(data) {
        this.validate(data);
        return await this.model.create(data);
    }

    async update(id, data) {
        this.validate(data);
        return await this.model.update(id, data);
    }

    async delete(id) {
        return await this.model.delete(id);
    }
}

module.exports = UserService;