const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectToDB() {
  await client.connect();
  db = client.db();
  console.log("✅ MongoDB connected");
}

function getDB() {
  return db;
}

module.exports = { connectToDB, getDB };
