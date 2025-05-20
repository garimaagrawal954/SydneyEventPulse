import { MongoClient } from 'mongodb';

// Use the direct MongoDB connection string
const MONGODB_URI = 'mongodb+srv://user1:garima@cluster0.xahr26k.mongodb.net/';
// Set the database name
const DB_NAME = 'sydney_events';

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;
let mongoAvailable = false;

// This function will attempt to connect to MongoDB if a URI is provided
// Otherwise it will return null, which will cause the app to use in-memory storage
export async function connectToDatabase() {
  // If MongoDB URI is not set, we don't attempt to connect
  if (!MONGODB_URI) {
    console.log('MongoDB URI not set. Using in-memory storage instead.');
    mongoAvailable = false;
    return { client: null, db: null };
  }

  // If we already have a connected client and database, return them
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DB_NAME);
    
    // Cache the client and db connections
    cachedClient = client;
    cachedDb = db;
    mongoAvailable = true;
    
    console.log('Connected to MongoDB successfully');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    mongoAvailable = false;
    return { client: null, db: null };
  }
}

// Initialize collections
export async function initializeCollections() {
  const { db } = await connectToDatabase();
  
  // If MongoDB is not available, we don't initialize collections
  if (!db || !mongoAvailable) {
    return;
  }
  
  try {
    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes('events')) {
      await db.createCollection('events');
    }
    
    if (!collectionNames.includes('subscribers')) {
      await db.createCollection('subscribers');
    }
    
    if (!collectionNames.includes('ticketClicks')) {
      await db.createCollection('ticketClicks');
    }
    
    // Create indexes
    await db.collection('events').createIndex({ id: 1 }, { unique: true });
    await db.collection('subscribers').createIndex({ email: 1 }, { unique: true });
    await db.collection('ticketClicks').createIndex({ id: 1 }, { unique: true });
    
    console.log('MongoDB collections initialized');
  } catch (error) {
    console.error('Failed to initialize MongoDB collections:', error);
    mongoAvailable = false;
  }
}

// Check if MongoDB is available
export function isMongoAvailable() {
  return mongoAvailable;
}