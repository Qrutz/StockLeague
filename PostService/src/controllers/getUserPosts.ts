import { db } from '../db/setup';
import * as schema from '../db/schema';
import { Request, Response } from 'express';
import axios from 'axios';
import { and } from 'drizzle-orm';
import prisma from '../../prisma/setup';

export const getUserPosts = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: 'User ID is required' });
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: userId,
        parentId: null,
      },
      include: {
        likes: true,
        children: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // if we found any posts, we need to get the user object for the author, and return that as well, obviously there is only one author per post, so we can just grab the first one
    if (!posts) {
      return res
        .status(404)
        .json({ success: false, message: 'No posts found' });
    }

    const authorData = await axios.post('http://localhost:3004/', {
      ids: [userId],
    });

    const userObject = authorData.data[0];

    const postsWithAuthor = posts.map((post) => {
      console.log('Post:', post);
      const hasLiked = post.likes.some((like) => like.userId === userId);
      return { ...post, hasLiked, authorObject: userObject };
    });

    console.log('Posts with Author:', postsWithAuthor);

    // const poster = authorData.data.data[0];
    // for each post, add the author  object as poster: author
    // const postsWithAuthor = posts.map((post) => {
    //   const hasLiked = post.likes.some((like) => like.userId === userId);
    //   return { ...post, hasLiked, poster };
    // });

    return res.status(200).json({ success: true, data: postsWithAuthor });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, message: error });
  }
};
