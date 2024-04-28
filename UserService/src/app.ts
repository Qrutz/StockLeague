import express, { Request } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
const localtunnel = require('localtunnel');

import UserRouter from './Users/UserController';
import Webhookrouter from './Users/Webhook';

const http = require('http');

// For env File
dotenv.config();

const app = express();

const port = process.env.PORT || 3004;

app.use(cors());

app.use('/api/webhooktest', Webhookrouter);
app.use(express.json());

app.use('/', UserRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(port, () => {
  console.log(`Server running on  port ${port}`);
});

// (async () => {
//   const tunnel = await localtunnel({ port: 3004 });

//   // the assigned public url for your tunnel
//   // i.e. https://abcdefgjhij.localtunnel.me
//   console.log(tunnel.url);

//   tunnel.on('close', () => {
//     // tunnels are closed
//   });
// })();
