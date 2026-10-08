import mongoose from 'mongoose';
import { setDefaultResultOrder } from 'node:dns';

setDefaultResultOrder('ipv4first');

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Add it in the Render Environment tab, then redeploy.',
    );
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    family: 4,
    serverSelectionTimeoutMS: 20000,
  });
}
