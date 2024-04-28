import { Request, Response } from 'express';
import { likes, posts } from '../db/schema';
import { db } from '../db/setup';
import { and, eq, sql } from 'drizzle-orm';
import sendMessage from '../kafka/sendMessage';
import pusher from '../utils/pusherConfig';
import prisma from '../../prisma/setup';

const checkUserLikes = async (req: Request, res: Response) => {
  const postsIds: number[] = req.body.postsIds;

  const currentUserId = req.body.userId;

  if (!currentUserId) {
    return res
      .status(400)
      .json({ success: false, data: null, message: 'User ID is required' });
  }

  // we want to check if the currentUserId has liked any of the posts in the postsIds array and return {postId: true} if they have liked the post and {postId: false} if they have not liked the post
  // we can do this by querying the likes table with the currentUserId and the postsIds array
  // if the query returns a result then the user has liked the post

  try {
    // const userLikes = await db
    //   .select()
    //   .from(likes)
    //   .where(and(eq(likes.userId, currentUserId), sql`postId IN ${postsIds}`));
    const userLikes = await prisma.likes.findMany({
      where: {
        userId: currentUserId,
        postId: {
          in: postsIds,
        },
      },
    });

    const userLikesMap = userLikes.reduce((acc: any, like: any) => {
      acc[like.postId] = true;
      return acc;
    }, {});

    const userLikesMapWithFalse = postsIds.reduce((acc: any, postId: any) => {
      if (!userLikesMap[postId]) {
        acc[postId] = false;
      }
      return acc;
    }, userLikesMap);

    return res.status(200).json(userLikesMapWithFalse);
  } catch (error) {
    return res.status(500).json({ success: false, data: null, message: error });
  }
};

export default checkUserLikes;
