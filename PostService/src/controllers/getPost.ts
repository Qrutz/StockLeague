import { Request, Response } from 'express';
import { likes, posts, predictions } from '../db/schema';
import { db } from '../db/setup';
import * as schema from '../db/schema';
import { and, eq, sql } from 'drizzle-orm';
import sendMessage from '../kafka/sendMessage';

import clerkClient from '@clerk/clerk-sdk-node';
import axios from 'axios';
import {
  MySqlDialect,
  alias,
  union,
  unionAll,
  unique,
} from 'drizzle-orm/mysql-core';
import prisma from '../../prisma/setup';

const getPost = async (req: Request, res: Response) => {
  const postId = req.params.id;

  const userId = req.userId;

  if (!postId || !userId) {
    return res
      .status(400)
      .json({ success: false, message: 'Post ID and User ID are required' });
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
      include: {
        likes: true,
        children: {
          include: {
            likes: true,
          },
        },

        parent: {
          include: {
            likes: true,
          },
        },
      },
    });

    console.log(post);

    // const post = await db.execute(
    //   sql.raw(`
    //   WITH RECURSIVE CommentHierarchy AS (
    //     SELECT id, content, userId, gifUrl, timestamp, 1 as depth
    //     FROM postsNestedTest
    //     WHERE id = ${postId}
    //     UNION ALL
    //     SELECT p.id, p.content, p.userId, p.gifUrl, p.timestamp, ch.depth + 1
    //     FROM postsNestedTest p
    //     INNER JOIN CommentHierarchy ch ON p.parentPostId = ch.id
    //     )
    //   SELECT * FROM CommentHierarchy;
    // `)
    // );

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    // we want to grab the authorId from the post and turn it into a user object

    // find out if the user has liked, if so return hasLiked: true on the post
    const existingLike = await prisma.likes.findFirst({
      where: {
        AND: {
          postId: Number(postId),
          userId: userId,
        },
      },
    });

    const hasLiked = Boolean(existingLike);

    // const hasLiked = existingLike.length > 0;

    // // Fetch commenter data for each unique userId in comments
    const uniqueUserIds = [
      ...new Set(post.children.map((comment) => comment.userId)),
    ];

    // push the post author id into the array
    uniqueUserIds.push(post.userId);

    // push even the parent post id
    if (post.parent) {
      uniqueUserIds.push(post.parent.userId);
    }

    // // uniqueUserIds.push(post.userId);
    const commenterData = await axios
      .post('http://localhost:3004/', {
        ids: uniqueUserIds,
      })
      .then((res) => res.data);
    console.log(commenterData);

    // find the poster data from the repsonse
    const posterData = commenterData.find(
      (user) => user.userId === post.userId
    );

    // Map commenter data to a lookup object
    const commenterLookup = commenterData.reduce((acc, user) => {
      console.log(user);
      acc[user.userId] = user;
      return acc;
    }, {});

    // // Transform comments to include commenter details, just add the user object to the comment object so we dont return doubles
    // Enrich comments with commenter details
    const enrichedComments = post.children.map((comment) => ({
      ...comment,
      authorObject: commenterLookup[comment.userId],
      hasLiked: comment.likes.some((like) => like.userId === userId),
    }));

    // enrich the parent post if it exists
    const enrichedParentPost = post.parent
      ? {
          ...post.parent,
          authorObject: commenterLookup[post.parent.userId],
          hasLiked: post.parent.likes.some((like) => like.userId === userId),
        }
      : null;

    // Transform post to include author details
    post.children = enrichedComments;
    post.parent = enrichedParentPost;
    // console.log(transformedComments.map((comment) => comment.authorObject));
    return res.json({
      success: true,
      data: {
        ...post,
        authorObject: posterData,
        hasLiked,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default getPost;
