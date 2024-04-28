import axios from 'axios';
import redisClient from '../redis/client';
import { Request, Response } from 'express';

export async function getGlobalFeed(req: Request, res: Response) {
  const userId = req.userId;
  //
  try {
    // const posts = await redisClient.lrange('global-feed', 0, 11);
    // if (!posts || posts.length === 0) {
    //   res.json([]);
    //   return;
    // }
    // // find all unique userIds in the posts
    // const userIds = posts.map((post) => JSON.parse(post).userId);
    // // get the user objects for all the userIds, put ids in the body
    // const users = await axios.post('http://localhost:3004/', {
    //   ids: userIds,
    // });
    // const parsedPosts = await Promise.all(
    //   posts.map(async (post) => {
    //     let postObj = JSON.parse(post);
    //     // get count of users liking the post, and check if the current user has liked the post, return the count and hasLiked boolean
    //     const likeCount = await redisClient.scard(
    //       `post-likes:${postObj.insertedPostId}`
    //     );
    //     const hasLiked = await redisClient.sismember(
    //       `post-likes:${postObj.insertedPostId}`,
    //       userId
    //     );
    //     // get count of users commenting on the post, and check if the current user has commented on the post, return the count and hasCommented boolean
    //     const commentCount = await redisClient.llen(
    //       `post-comments:${postObj.insertedPostId}`
    //     );
    //     const hasCommented = await redisClient
    //       .lpos(`post-comments:${postObj.insertedPostId}`, userId)
    //       .then((res) => {
    //         // if res is an integer then return true
    //         if (typeof res === 'number') {
    //           return true;
    //         }
    //         return false;
    //       });
    //     // find the user object for the post
    //     const user = users.data.find(
    //       (user: any) => user.userId === postObj.userId
    //     );
    //     console.log('user', users.data);
    //     return {
    //       ...postObj,
    //       likeCount,
    //       hasLiked,
    //       commentCount,
    //       hasCommented,
    //       poster: user,
    //     };
    //   })
    // );
    // console.log('parsedPosts', parsedPosts);
    // res.json(parsedPosts);
  } catch (error) {
    console.error('Error fetching global feed: ', error);
    res.status(500).json({ message: 'Failed to fetch global feed' });
  }
}
