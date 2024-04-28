import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config();

console.log('gaFf');

if (!process.env.DB_URL) {
  throw new Error('DB credentials error');
}

const connection = mysql.createConnection(process.env.DB_URL);

export const db = drizzle(connection, { mode: 'default', schema: schema });
