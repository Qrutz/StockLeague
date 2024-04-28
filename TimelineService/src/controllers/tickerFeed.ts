import axios from 'axios';
import redisClient from '../redis/client';
import { Request, Response } from 'express';
import { db } from '../db/setup';
import { posts } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import {
  fetchLikesDataForUser,
  fetchUsersInBatch,
} from '../utils/usersService';
import prisma from '../../prisma/setup';

export async function getTickerFeed(req: Request, res: Response) {
  try {
    const currentUserId = req.userId;

    if (!currentUserId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const ticker = req.params.ticker;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const postsByTicker = await prisma.post.findMany({
      where: {
        mentionedTickers: {
          has: ticker,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });

    const uniqueUserIds = [
      ...new Set(postsByTicker.map((post) => post.userId)),
    ];

    // Convert post IDs to strings for the likes data fetch
    const postIdsAsString = postsByTicker.map((post) => post.id);

    // Use Promise.all to fetch user data and likes data in parallel
    const [users, likesData] = await Promise.all([
      fetchUsersInBatch(uniqueUserIds),
      fetchLikesDataForUser(currentUserId, postIdsAsString),
    ]);

    console.log(likesData);

    // Aggregate user data and likes data with posts
    const aggregatedPosts = postsByTicker.map((post) => {
      const user = users.find((user) => user.userId === post.userId);
      const hasLiked = likesData[post.id]; // Assuming likesData is an object with post IDs as keys
      return {
        ...post,
        authorObject: user,
        hasLiked: !!hasLiked, // Convert truthy/falsy value to boolean
      };
    });

    res.json(aggregatedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
