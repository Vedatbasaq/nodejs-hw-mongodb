/* eslint-disable no-undef */
import mongoose from 'mongoose';
import 'dotenv/config';

export const initMongoConnection = async () => {
  const user = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;
  const url = process.env.MONGODB_URL;
  const db = process.env.MONGODB_DB;

  const connectionString = `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(connectionString);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection error:', error);
    process.exit(1);
  }
};