import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import { Kafka } from 'kafkajs';
import type { Consumer } from 'kafkajs';
import Redis, { RedisKey, RedisValue } from 'ioredis';
import { like, sql } from 'drizzle-orm';
import axios from 'axios';
import * as schema from '../db/schema';
import prisma from '../../prisma/setup';

import { InsertPost, InsertPrediction, posts, predictions } from '../db/schema';
import { db } from '../db/setup';
import { consumer } from './setup';

import Pusher from 'pusher';
dotenv.config();

async function initializeKafkaConsumer() {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: 'eu',
    useTLS: true,
  });

  await consumer.connect();

  // Subscribe to multiple topics
  await consumer.subscribe({ topic: 'postsCreated', fromBeginning: true });
  await consumer.subscribe({ topic: 'postsLiked', fromBeginning: true });
  await consumer.subscribe({ topic: 'postsCommented', fromBeginning: true });
  await consumer.subscribe({ topic: 'predictionCreated', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        if (!message.value) {
          throw new Error('No message value');
        }
        console.log(topic, message.value.toString());

        switch (topic) {
          case 'postsCreated':
            // Handle postTopic messages
            const post = JSON.parse(message.value.toString());

            // Store the post in post DB
            await prisma.post.create({
              data: {
                id: post.id,
                content: post.content,
                mentionedTickers: post.mentionedTickers,
                userId: post.userId,
                likesCount: 0,
                commentsCount: 0,
                gifUrl: post.gifUrl,
              },
            });

            // Trigger the websocket for new post
            pusher.trigger('global-timeline', 'new-post', {
              authorId: post.userId,
            });
            break;

          case 'predictionCreated':
            const prediction = JSON.parse(
              message.value.toString()
            ) as InsertPrediction;

            // Store the prediction in post DB
            await db.insert(predictions).values(prediction).execute();

            break;

          case 'postsLiked':
            // Handle like-post messages
            const likeData = JSON.parse(
              message.value.toString()
            ) as postLikeEvent;
            if (likeData.eventType == 'like') {
              console.log('likeData', likeData);
              // Tell the client we have updated the like count

              await prisma.post.update({
                where: {
                  id: parseInt(likeData.postId),
                },
                data: {
                  likesCount: {
                    increment: 1,
                  },
                },
              });

              pusher.trigger('global-timeline', 'new-like', {
                postId: parseInt(likeData.postId),
              });
            } else if (likeData.eventType == 'unlike') {
              console.log('unlikeData', likeData);
              // await redisClient.srem(
              //   `post-likes:${likeData.postId}`,
              //   likeData.userId
              // );
              // Tell the client we have updated the like count
              pusher.trigger('global-timeline', 'new-like', {
                postId: parseInt(likeData.postId),
                userId: likeData.userId,
              });

              await prisma.post.update({
                where: {
                  id: parseInt(likeData.postId),
                },
                data: {
                  likesCount: {
                    decrement: 1,
                  },
                },
              });
            }

            pusher.trigger('global-timeline', 'new-like', {
              postId: parseInt(likeData.postId),
            });

            break;

          case 'postsCommented':
            // Handle comment-post messages
            const commentData = JSON.parse(
              message.value.toString()
            ) as postCommentEvent;
            if (commentData.eventType == 'comment') {
              console.log('commentData', commentData);
              // await updateCommentCountInRedis(
              //   commentData.postId,
              //   commentData.userId
              // );
              // Tell the client we have updated the comment count
              // pusher.trigger('global-timeline', 'new-comment', {
              //   postId: parseInt(commentData.postId),
              //   userId: commentData.userId,
              // });

              await db.execute(
                sql`UPDATE postsStorage SET commentsCount = commentsCount + 1 WHERE id = ${commentData.postId}`
              );
            } else if (commentData.eventType == 'uncomment') {
              console.log('uncommentData', commentData);
              // await redisClient.srem(
              //   `post-comments:${commentData.postId}`,
              //   commentData.userId
              // );
              // Tell the client we have updated the comment count
              // pusher.trigger('global-timeline', 'new-comment', {
              //   postId: parseInt(commentData.postId),
              //   userId: commentData.userId,
              // });

              await db.execute(
                sql`UPDATE postsStorage SET commentsCount = commentsCount - 1 WHERE id = ${commentData.postId}`
              );
            }

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

export { initializeKafkaConsumer };
