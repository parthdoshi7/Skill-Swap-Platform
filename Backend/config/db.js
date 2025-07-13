const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./auth.env" });

const mongoURI = process.env.MONGO_URI;
const dbName = 'Skill_Swap';

let db;

const connectToMongoDB = async () => {
  const client = new MongoClient(mongoURI);
  await client.connect();
  db = client.db(dbName);
  console.log("✅ MongoDB connected");
};

const getDB = () => db;

module.exports = { connectToMongoDB, getDB };