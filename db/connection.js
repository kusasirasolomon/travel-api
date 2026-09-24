const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);   // force Google DNS
const { MongoClient } = require("mongodb");

let db;

async function connectToDatabase() {
    try {
        const client = new MongoClient(process.env.MONGODB_URI);

        await client.connect();

        db = client.db(process.env.DB_NAME);

        console.log("Connected to MongoDB");

        return db;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

function getDb() {
    if (!db) {
        throw new Error("Database is not connected.");
    }

    return db;
}

module.exports = {
    connectToDatabase,
    getDb
};