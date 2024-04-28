import redisClient from './client';

async function storeInRedis(post: Post) {
  const key = 'global-feed'; // Key for the global feed list
  const postValue = JSON.stringify(post);
  await redisClient.lpush(key, postValue);
  await redisClient.ltrim(key, 0, 999); // Keep only the 1000 most recent posts
}

async function updateLikeCountInRedis(postId: string, userId: string) {
  // add userId to the list of users who liked the post
  // check if user has already liked the post
  const hasLiked = await redisClient.sismember(`post-likes:${postId}`, userId);

  if (hasLiked) {
    return;
  }

  await redisClient.sadd(`post-likes:${postId}`, userId);
}

async function updateCommentCountInRedis(postId: string, userId: string) {
  // add userId to the list of users who commented on the post
  // check if user is in the list of users who commented on the post

  // add to list, not set
  await redisClient.lpush(`post-comments:${postId}`, userId);
}
