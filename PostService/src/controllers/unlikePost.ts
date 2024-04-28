import { Request, Response } from 'express';
import { likes, posts } from '../db/schema';
import { db } from '../db/setup';
import { and, eq, sql } from 'drizzle-orm';
import sendMessage from '../kafka/sendMessage';
import pusher from '../utils/pusherConfig';
import prisma from '../../prisma/setup';

const unlikePost = async (req: Request, res: Response) => {
  const postId = req.params.id;

  const userId = req.userId;

  if (!postId || !userId) {
    return res
      .status(400)
      .json({ success: false, message: 'Post ID and User ID are required' });
  }

  // Check if the post exists
  const existingPost = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  if (!existingPost) {
    return res
      .status(400)
      .json({ success: false, message: 'Post does not exist' });
  }

  const existingLike = await prisma.likes.findFirst({
    where: {
      AND: {
        postId: Number(postId),
        userId: userId,
      },
    },
  });

  if (!existingLike) {
    // return status code 400, and a message saying you cant unlike a post you havent liked
    return res
      .status(400)
      .json({ message: 'You cannot unlike a post you have not liked' });
  }

  try {
    await prisma.likes.delete({
      where: {
        id: existingLike.id,
        userId,
      },
    });

    // pusher.trigger(`post-${postId}`, 'like-event', { userId });

    sendMessage('postsLiked', JSON.stringify({ postId, eventType: 'unlike' }));
    return res.json({ success: true, message: 'Like removed successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Unable to process request', error });
  }
};

export default unlikePost;
