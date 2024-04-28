import { Request, Response } from 'express';
import { posts } from '../db/schema';
import { db } from '../db/setup';
import { and, eq } from 'drizzle-orm';

const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;

  const userId = req.userId;

  if (!postId) {
    return res
      .status(400)
      .json({ success: false, data: null, message: 'ID is required' });
  }

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, data: null, message: 'User ID is required' });
  }

  try {
    await db
      .delete(posts)
      .where(and(eq(posts.id, Number(postId)), eq(posts.author, userId)));

    return res.status(201).json({
      data: { postId, userId },
      message: 'Deleted Successfully',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, data: null, message: 'Unable to delete' });
  }
};

export default deletePost;
