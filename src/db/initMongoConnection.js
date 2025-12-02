/* eslint-disable no-undef */
import mongoose from 'mongoose';
import 'dotenv/config';

export const initMongoConnection = async () => {
  const user = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;
  const url = process.env.MONGODB_URL;
  const db = process.env.MONGODB_DB;

  if (!user || !password || !url || !db) {
    const missing = [
      !user && 'MONGODB_USER',
      !password && 'MONGODB_PASSWORD',
      !url && 'MONGODB_URL',
      !db && 'MONGODB_DB',
    ].filter(Boolean).join(', ');
    console.error(`Missing MongoDB env variables: ${missing}`);
    process.exit(1);
  }

  const sanitizedUrl = url
    .replace(/^mongodb\+srv:\/\//i, '')
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*/, '')
    .replace(/\?.*/, '');

  const connectionString = `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${sanitizedUrl}/${db}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(connectionString);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection error:', error);
    process.exit(1);
  }
};
