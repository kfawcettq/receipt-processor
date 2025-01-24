'use strict';
const { MongoMemoryServer } = require('mongodb-memory-server');
var mongoose = require('mongoose');

module.exports = {
    createConnection: async () => {
        const mongoMemoryServer = await MongoMemoryServer.create();
        const mongoURI = mongoMemoryServer.getUri();
        await mongoose.connect(mongoURI);
    }
}

