import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import feedRoutes from './routes/feedRoutes';

dotenv.config();

import { initializeKafkaConsumer } from './kafka/consumer';

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3002;

app.use('/', feedRoutes);

app.listen(port, () => {
  console.log(`Server is running on port! ${port}`);
  initializeKafkaConsumer();
});
