import cors from 'cors';
import express, { Request } from 'express';
const { drizzle } = require('drizzle-orm');
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import postRouter from './routes/postRouter';
import commentRouter from './routes/commentRotuer';
import utilsRouter from './routes/utilsRouter';
import { Kafka } from 'kafkajs';
import Pusher from 'pusher';
import { checkAuthHeader } from './middleware/authmiddleware';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;

// export const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID!,
//   key: process.env.PUSHER_KEY!,
//   secret: process.env.PUSHER_SECRET!,
//   cluster: 'eu',
//   useTLS: true,
// });

// const kafka = new Kafka({
//     clientId: 'my-app',
//     brokers: ['localhost:9092']
// });

// // Asynchronous function to initialize Kafka producer
// async function initializeKafkaProducer() {
//     const producer = kafka.producer();

//     try {
//         await producer.connect();
//         await producer.send({
//             topic: 'test-topic',
//             messages: [{ value: 'Hello KafkaJS user!' }],
//         });
//         console.log("Kafka producer initialized and message sent");
//     } catch (error) {
//         console.error("Error initializing Kafka producer:", error);
//     } finally {
//         await producer.disconnect();
//     }
// }

// // Call the function to initialize Kafka producer
// initializeKafkaProducer();

app.use(cors());
app.use(express.json());

app.use('/utils', utilsRouter);
app.use('/', checkAuthHeader, postRouter);
app.use('/', commentRouter);

app.listen(port, () => {
  console.log(`Server is running on pofrt ${port}`);
});
