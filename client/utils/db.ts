



// utils/db.ts
import mongoose, { Connection } from 'mongoose';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<Connection> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error('❌ MONGODB_URI is not defined');
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => mongoose.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

