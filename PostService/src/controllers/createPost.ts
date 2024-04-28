import { Request, Response } from 'express';
import { posts, postsNestedTest, predictions } from '../db/schema';
import { db } from '../db/setup';
import sendMessage from '../kafka/sendMessage';
import axios from 'axios';
import prisma from '../../prisma/setup';

type Post = {
  content: string;
  gifUrl?: string;
  mentionedTickers?: string[];
  prediction?: {
    ticker: string;
    predictedMovement: number;
    dateAtFinal: string;
  };
};

const createPost = async (req: Request, res: Response) => {
  const { content, gifUrl, mentionedTickers, prediction } = req.body as Post;

  const userId = req.userId;

  console.log('User ID:', userId);

  if (!content) {
    return res
      .status(400)
      .json({ success: false, data: null, message: 'Content is required' });
  }

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, data: null, message: 'User ID is required' });
  }

  try {
    // const result = await db.insert(postsNestedTest).values({
    //   content: content,
    //   userId: userId,
    //   gifUrl: gifUrl || null,
    //   timestamp: currentDate,
    // });
    const result = await prisma.post.create({
      data: {
        content: content,
        mentionedTickers: mentionedTickers,
        userId: userId,
        gifUrl: gifUrl || null,
      },
    });

    // const insertedPostId = result[0].insertId;

    // check if theres a prediction included in the request body
    // if (prediction) {
    //   const { ticker, predictedMovement, dateAtFinal } = prediction;
    //   const priceAtGuess = await fetchStockPrice(ticker);

    //   const result = await db.insert(predictions).values({
    //     postId: insertedPostId,
    //     ticker,
    //     priceAtGuess,
    //     predictedMovement,
    //     dateAtFinal,
    //     dateAtGuess: currentDate,
    //     userId,
    //   });

    //   // get id for prediction
    //   const insertedPredictionId = result[0].insertId;

    //   // send a message to kafka with the prediction data
    //   sendMessage(
    //     'predictionCreated',
    //     JSON.stringify({
    //       id: insertedPredictionId,
    //       postId: insertedPostId,
    //       ticker,
    //       priceAtGuess,
    //       predictedMovement,
    //       dateAtFinal,
    //       dateAtGuess: currentDate,
    //       userId,
    //     })
    //   );

    //   // if we get an error, return a 500
    //   // if (result[0].affectedRows === 0) {
    //   //   return res.status(500).json({
    //   //     success: false,
    //   //     data: null,
    //   //     message: 'Error creating prediction',
    //   //   });
    //   // }
    // }

    // send message to kafka including the post data
    sendMessage(
      'postsCreated',
      JSON.stringify({
        id: result.id,
        content,
        mentionedTickers,
        gifUrl,
        userId,
        timestamp: result.timestamp,
      })
    );

    return res.status(201).json({
      success: true,
      data: { id: result.id },
      message: 'Post created successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, message: error });
  }
};

async function fetchStockPrice(ticker: string) {
  // Logic to fetch stock price for the given tickers
  // This could involve calling an external API
  const apikey = process.env.FMP_API_KEY;
  console.log('API Key:', apikey);
  const url = `https://financialmodelingprep.com/api/v3/quote-short/${ticker}?apikey=${apikey}`;
  const response = await axios.get(url).then((res) => res.data);

  const price = response[0].price;

  console.log('Stock price for', ticker, 'is', price);

  return price;
}
export default createPost;
