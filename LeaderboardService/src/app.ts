import cors from 'cors';
import express, { Request } from 'express';
const { drizzle } = require('drizzle-orm');
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { Kafka } from 'kafkajs';
import Pusher from 'pusher';
import axios from 'axios';
import { db } from './db/setup';
import { PostAccuracyDetails, UserLeaderboard } from './db/schema';
import { asc, desc, eq } from 'drizzle-orm';

dotenv.config();

import clerkClient from '@clerk/clerk-sdk-node';

const app = express();

const port = process.env.PORT || 3005;

const kafka = new Kafka({
  clientId: 'leaderboard-service',
  brokers: ['172.25.47.103:9092'],
});

interface Post {
  insertedPostId: number;
  content: string;
  ticker: string;
  predictedMovement: number;
  priceAtGuess: number;
  dateAtGuess: string;
  dateAtFinal: string;
  userId: string;
}

async function calculateAccuracyScore(post: Post, currentPrice: number) {
  // fetch current price from api here TODO

  const predictedMovement = post.predictedMovement;
  const priceAtGuess = post.priceAtGuess;
  const actualMovement = ((currentPrice - priceAtGuess) / priceAtGuess) * 100;

  let accuracyScore = 0;

  if (
    (predictedMovement < 0 && actualMovement > 0) ||
    (predictedMovement > 0 && actualMovement < 0)
  ) {
    accuracyScore = 0;
  } else if (Math.abs(predictedMovement) >= Math.abs(actualMovement)) {
    accuracyScore =
      (Math.abs(actualMovement) / Math.abs(predictedMovement)) * 100;
  } else {
    accuracyScore =
      (Math.abs(predictedMovement) / Math.abs(actualMovement)) * 100;
  }

  return accuracyScore;
}

async function fetchStockPrice(ticker: string) {
  // Logic to fetch stock price for the given ticker
  // This could involve calling an external API
  const apikey = process.env.FMP_API_KEY;
  console.log('API Key:', apikey);
  const url = `https://financialmodelingprep.com/api/v3/quote-short/${ticker}?apikey=${apikey}`;
  const response = await axios.get(url).then((res) => res.data);

  const price = response[0].price;

  console.log('Stock price for', ticker, 'is', price);

  return price;
}

async function updateLeaderboardScores(userId: string, accuracyScore: number) {
  const leaderboard = await db.query.UserLeaderboard.findFirst({
    where: eq(UserLeaderboard.UserId, userId),
  }).execute();

  if (!leaderboard) {
    // we gotta create one for this user
    await db
      .insert(UserLeaderboard)
      .values({
        UserId: userId,
        TotalAccuracyScore: accuracyScore,
        WeeklyAccuracyScore: accuracyScore,
        MonthlyAccuracyScore: accuracyScore,
        YearlyAccuracyScore: accuracyScore,
      })
      .execute();
    return;
  }

  const totalAccuracyScore = leaderboard.TotalAccuracyScore + accuracyScore;
  const weeklyAccuracyScore = leaderboard.WeeklyAccuracyScore + accuracyScore;
  const monthlyAccuracyScore = leaderboard.MonthlyAccuracyScore + accuracyScore;
  const yearlyAccuracyScore = leaderboard.YearlyAccuracyScore + accuracyScore;

  await db
    .update(UserLeaderboard)
    .set({
      TotalAccuracyScore: totalAccuracyScore,
      WeeklyAccuracyScore: weeklyAccuracyScore,
      MonthlyAccuracyScore: monthlyAccuracyScore,
      YearlyAccuracyScore: yearlyAccuracyScore,
    })
    .where(eq(UserLeaderboard.UserId, userId))
    .execute();
}

async function initializeKafkaConsumer() {
  const consumer = kafka.consumer({ groupId: 'leaderboard-group' });

  await consumer.connect();

  // Subscribe to multiple topics
  await consumer.subscribe({ topic: 'postTopic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        if (!message.value) {
          throw new Error('No message value');
        }
        console.log(topic, message.value.toString());

        switch (topic) {
          case 'postTopic':
            // Handle postTopic messages
            const post = JSON.parse(message.value.toString());
            const currentPrice = await fetchStockPrice(post.ticker);
            const accuracyScore = await calculateAccuracyScore(
              post,
              currentPrice
            );
            const actualMovement =
              ((currentPrice - post.priceAtGuess) / post.priceAtGuess) * 100;

            await db
              .insert(PostAccuracyDetails)
              .values({
                PostId: post.insertedPostId,
                UserId: post.userId,
                Ticker: post.ticker,
                PredictedMovement: post.predictedMovement,
                ActualMovement: actualMovement,
                AccuracyScore: accuracyScore,
                PredictionDate: post.dateAtGuess,
                EvaluatedDate: Date.now().toString(),
              })
              .execute();

            await updateLeaderboardScores(post.userId, accuracyScore);

            break;

          default:
            console.log(`Unhandled topic: ${topic}`);
        }
      } catch (processingError) {
        console.error('Error processing message:', processingError);
      }
    },
  });

  console.log('Kafka consumer initialized and running');
}

initializeKafkaConsumer().catch((error) => {
  console.error('Failed to initialize Kafka consumer:', error);
  process.exit(1);
});

app.use(cors());
app.use(express.json());

app.get('/weekly', async (req, res) => {
  try {
    const leaderboard = await db.query.UserLeaderboard.findMany({
      orderBy: (UserLeaderboard) => [desc(UserLeaderboard.WeeklyAccuracyScore)],
    }).execute();

    // get all unique users and fetch in batch from axios endpoiint
    const userIds = leaderboard.map(
      (userLeaderboard) => userLeaderboard.UserId
    );
    const uniqueUserIds = [...new Set(userIds)];

    const users = await axios.post('http://localhost:3004/', {
      ids: uniqueUserIds,
    });

    // add user object to leaderboard object
    const leaderboardWithUsers = leaderboard.map((userLeaderboard) => {
      const user = users.data.find(
        (user) => user.userId === userLeaderboard.UserId
      );
      return {
        ...userLeaderboard,
        User: user,
      };
    });

    res.send(leaderboardWithUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the leaderboard.');
  }
});

app.get('/monthly', async (req, res) => {
  try {
    const leaderboard = await db.query.UserLeaderboard.findMany({
      orderBy: (UserLeaderboard) => [
        desc(UserLeaderboard.MonthlyAccuracyScore),
      ],
    }).execute();

    // get all unique users and fetch in batch from axios endpoiint
    const userIds = leaderboard.map(
      (userLeaderboard) => userLeaderboard.UserId
    );
    const uniqueUserIds = [...new Set(userIds)];

    const users = await axios.post('http://localhost:3004/', {
      ids: uniqueUserIds,
    });

    // add user object to leaderboard object
    const leaderboardWithUsers = leaderboard.map((userLeaderboard) => {
      const user = users.data.find(
        (user) => user.userId === userLeaderboard.UserId
      );
      return {
        ...userLeaderboard,
        User: user,
      };
    });

    res.send(leaderboardWithUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the leaderboard.');
  }
});

app.get('/yearly', async (req, res) => {
  try {
    const leaderboard = await db.query.UserLeaderboard.findMany({
      orderBy: (UserLeaderboard) => [desc(UserLeaderboard.YearlyAccuracyScore)],
    }).execute();

    // get all unique users and fetch in batch from axios endpoiint
    const userIds = leaderboard.map(
      (userLeaderboard) => userLeaderboard.UserId
    );
    const uniqueUserIds = [...new Set(userIds)];

    const users = await axios.post('http://localhost:3004/', {
      ids: uniqueUserIds,
    });

    // add user object to leaderboard object
    const leaderboardWithUsers = leaderboard.map((userLeaderboard) => {
      const user = users.data.find(
        (user) => user.userId === userLeaderboard.UserId
      );
      return {
        ...userLeaderboard,
        User: user,
      };
    });

    res.send(leaderboardWithUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the leaderboard.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on pofrt ${port}`);
});
