const { ObjectId } = require('mongodb');

class User {
    constructor(db) {
        this.collection = db.collection('users');
    }

    async findAll() {
        return await this.collection.find({}).toArray();
    }

    async findById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    async create(data) {
        const result = await this.collection.insertOne({ ...data, created_at: new Date() });
        return { _id: result.insertedId, ...data };
    }

    async update(id, data) {
        return await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
    }

    async delete(id) {
        return await this.collection.deleteOne({ _id: new ObjectId(id) });
    }
}

module.exports = User;