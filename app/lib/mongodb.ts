import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Missing MONGODB_URI environment variable');
}

const uri = process.env.MONGODB_URI;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

try {
  client = new MongoClient(uri);
  clientPromise = client.connect();
} catch (e) {
  console.error('Failed to connect to MongoDB', e);
  throw e;
}


export default clientPromise;