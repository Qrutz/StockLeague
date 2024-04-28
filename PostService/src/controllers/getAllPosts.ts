import { db } from '../db/setup';
import * as schema from '../db/schema';
import { Request, Response } from 'express';
import prisma from '../../prisma/setup';

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        likes: true,
      },
    });

    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, message: error });
  }
};
