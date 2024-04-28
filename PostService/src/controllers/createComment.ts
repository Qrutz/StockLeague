import { Request, Response } from 'express';
import { comments, posts } from '../db/schema';
import { db } from '../db/setup';
import sendMessage from '../kafka/sendMessage';
import { eq, sql } from 'drizzle-orm';
import pusher from '../utils/pusherConfig';
import prisma from '../../prisma/setup';

const createComment = async (req: Request, res: Response) => {
  const { content, gifUrl }: { content: string; gifUrl: string | null } =
    req.body;
  const postId = req.params.id;

  // convert postId to a number
  const postIdNumber = Number(postId);

  const userId = req.userId;

  if (!content) {
    return res
      .status(400)
      .json({ success: false, data: null, message: 'Content is required' });
  }

  if (!postId) {
    return res
      .status(400)
      .json({ success: false, data: null, message: 'Post ID is required' });
  }

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, data: null, message: 'User ID is required' });
  }

  try {
    // await db.insert(comments).values({
    //   content: content,
    //   gifUrl: gifUrl || null,
    //   postId: postIdNumber,
    //   userId: userId,
    //   timestamp: Date.now().toString(),
    // });
    await prisma.post.create({
      data: {
        content: content,
        userId: userId,
        gifUrl: gifUrl || null,
        parentId: postIdNumber,
      },
    });
    // idk we dont need to send anything just need to tell client to revalidate
    // pusher.trigger(`post-${postId}`, 'new-comment', { content, userId });

    sendMessage(
      'postsCommented',
      JSON.stringify({ postId, eventType: 'comment' })
    );

    return res.status(201).json({
      message: 'comment created successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, message: error });
  }
};

export default createComment;
