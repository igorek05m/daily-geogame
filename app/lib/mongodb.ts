import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  console.warn("WARN: Missing MONGODB_URI environment variable");
  clientPromise = Promise.reject(new Error("Missing MONGODB_URI"));
} else {
  try {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  } catch (e) {
    console.error('Failed to initialize MongoDB client', e);
    clientPromise = Promise.reject(e);
  }
}


export default clientPromise;