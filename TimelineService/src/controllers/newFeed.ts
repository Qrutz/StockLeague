import axios from 'axios';
import redisClient from '../redis/client';
import { Request, Response } from 'express';
import { db } from '../db/setup';

import { desc } from 'drizzle-orm';
import * as schema from '../db/schema';
import {
  fetchLikesDataForUser,
  fetchUsersInBatch,
} from '../utils/usersService';
import prisma from '../../prisma/setup';

export async function getNewFeed(req: Request, res: Response) {
  try {
    const currentUserId = req.userId;

    // if (!currentUserId) {
    //   res.status(401).json({ message: 'Unauthorized' });
    //   return;
    // }

    const ticker = (req.query.ticker as string | undefined)?.toUpperCase();

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    // Dynamically construct the query parameters
    let queryParameters: any = {
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    };

    // Add the where clause only if ticker is defined
    if (ticker) {
      queryParameters.where = {
        mentionedTickers: {
          has: ticker,
        },
      };
    }

    const newPosts = await prisma.post.findMany(queryParameters);

    // const newPosts = await prisma.post.findMany({
    //   where: {
    //     mentionedTickers: {
    //       has: ticker,
    //     },
    //   },
    //   orderBy: {
    //     timestamp: 'desc',
    //   },
    //   take: limit,
    // });

    console.log(newPosts);

    // Extract unique userIds from the posts
    const uniqueUserIds = [...new Set(newPosts.map((post) => post.userId))];

    // Convert post IDs to strings for the likes data fetch
    const postIdsAsString = newPosts.map((post) => post.id);

    // Use Promise.all to fetch user data and likes data in parallel
    const [users, likesData] = await Promise.all([
      fetchUsersInBatch(uniqueUserIds),
      fetchLikesDataForUser(currentUserId, postIdsAsString),
    ]);

    console.log(likesData);

    // Aggregate user data and likes data with posts
    const aggregatedPosts = newPosts.map((post) => {
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
    res.status(500).json({ error: error.message });
  }
}
