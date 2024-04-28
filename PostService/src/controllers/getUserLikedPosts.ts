import { db } from '../db/setup';
import * as schema from '../db/schema';
import { Request, Response } from 'express';
import axios from 'axios';
import { and } from 'drizzle-orm';
import prisma from '../../prisma/setup';

export const getUserLikedPosts = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: 'User ID is required' });
  }

  try {
    // find all posts that the user likes, and return them
    const posts = await prisma.likes.findMany({
      where: {
        userId,
      },
      include: {
        post: {
          include: {
            likes: true,
            children: true,
          },
        },
      },
    });

    // if we found any posts, we need to get the user object for the author, and return that as well, obviously there is only one author per post, so we can just grab the first one
    if (!posts) {
      return res
        .status(404)
        .json({ success: false, message: 'No posts found' });
    }

    const uniqueUserIds = [...new Set(posts.map((post) => post.post.userId))];

    const authorData = await axios.post('http://localhost:3004/', {
      ids: uniqueUserIds,
    });

    const authorObjects = authorData.data;

    console.log('Author Objects:', authorObjects);

    const postsWithAuthor = posts.map((post) => {
      const hasLiked = true;
      const authorObject = authorObjects.find(
        (user) => user.userId === post.post.userId
      );
      return { ...post.post, hasLiked, authorObject };
    });

    // const poster = authorData.data.data[0];
    // for each post, add the author  object as poster: author
    // const postsWithAuthor = posts.map((post) => {
    //   const hasLiked = post.likes.some((like) => like.userId === userId);
    //   return { ...post, hasLiked, poster };
    // });

    // return res.status(200).json({ success: true, data: postsWithAuthor });

    return res.status(200).json({ success: true, data: postsWithAuthor });
  } catch (error) {
    return res.status(500).json({ success: false, data: null, message: error });
  }
};
