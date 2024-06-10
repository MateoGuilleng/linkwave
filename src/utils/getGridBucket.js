// lib/mongodb.js
import { MongoClient, GridFSBucket } from "mongodb";

const uri = process.env.MONGO_URL;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGO_URL) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getGridFSBucket() {
  const client = await clientPromise;
  const db = client.db();
  return new GridFSBucket(db, { bucketName: "fs" });
}

export default clientPromise;
