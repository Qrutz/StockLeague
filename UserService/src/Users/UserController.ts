import * as express from 'express';
import clerkClient, {
  ClerkExpressRequireAuth,
  createClerkClient,
} from '@clerk/clerk-sdk-node';
import { db } from '../db/setup';
import * as schema from '../db/schema';
import { eq, sql } from 'drizzle-orm';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const authHeader = req.headers['x-custom-auth'] as string;

  if (!authHeader) {
    return res
      .status(400)
      .json({ success: false, message: 'Auth header is required' });
  }

  const auth = JSON.parse(authHeader);

  const userId = auth.userId;

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.userId, id),
    with: {
      followers: true,
      following: true,
    },
  });

  const isFollowing = await db.query.followers.findFirst({
    where: (followers, { eq }) => {
      return eq(followers.follower_id, userId) && eq(followers.followee_id, id);
    },
  });

  res.json({ ...user, isFollowing: isFollowing ? true : false });
});

router.post('/:id/follow', async (req, res) => {
  const { id } = req.params;

  const authHeader = req.headers['x-custom-auth'] as string;

  if (!authHeader) {
    return res
      .status(400)
      .json({ success: false, message: 'Auth header is required' });
  }

  const auth = JSON.parse(authHeader);

  const userId = auth.userId;

  // cant follow yourself
  if (userId === id) {
    return res.status(401).json({ error: 'You cant follow yourself bro' });
  }

  // check if the user is alreay following
  const isFollowing = await db.query.followers.findFirst({
    where: (followers, { eq }) => {
      return eq(followers.follower_id, userId) && eq(followers.followee_id, id);
    },
  });

  if (isFollowing) {
    return res
      .status(401)
      .json({ error: 'You are already following that user' });
  }

  const follow = await db
    .insert(schema.followers)
    .values({
      follower_id: userId,
      followee_id: id,
      created_at: new Date().toISOString(),
    })
    .execute();

  res.status(200).json({ message: 'You followed that user successfully' });
});

router.delete('/:id/unfollow', async (req, res) => {
  const { id } = req.params;

  const authHeader = req.headers['x-custom-auth'] as string;

  if (!authHeader) {
    return res
      .status(400)
      .json({ success: false, message: 'Auth header is required' });
  }

  const auth = JSON.parse(authHeader);

  const userId = auth.userId;

  // cant follow yourself
  if (userId === id) {
    return res.status(401).json({ error: 'You cant unfollow yourself bro' });
  }

  // check if the user is alreay following
  const isFollowing = await db.query.followers.findFirst({
    where: (followers, { eq }) => {
      return eq(followers.follower_id, userId) && eq(followers.followee_id, id);
    },
  });

  if (!isFollowing) {
    return res.status(401).json({ error: 'You are not following that user' });
  }

  const follow = await db
    .delete(schema.followers)
    .where(sql`follower_id = ${userId} and followee_id = ${id}`)
    .execute();

  res.status(200).json({ message: 'You unfollowed that user successfully' });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const authHeader = req.headers['x-custom-auth'] as string;

  if (!authHeader) {
    return res
      .status(400)
      .json({ success: false, message: 'Auth header is required' });
  }

  const auth = JSON.parse(authHeader);

  const userId = auth.userId;

  if (userId !== id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { first_name, last_name, email, username, bio, twitter_url } = req.body;

  // only update the fields that are passed in
  const user = await db
    .update(schema.users)
    .set({
      first_name,
      last_name,
      email,
      username,
      bio,
      twitter_url,
    })
    .where(sql`userId = ${id}`);

  res.status(200).json({ message: 'success' });
});

router.post('/', async (req, res) => {
  //take a batch of ids and return the users
  const { ids } = req.body as { ids: string[] };

  if (!ids || ids.length === 0) {
    return res.status(400).json({ error: 'ids are required' });
  }

  console.log(ids);
  const users = await db
    .select()
    .from(schema.users)
    .where(sql`userId in ${ids}`);

  res.json(users);
});

// fasdfas

export default router;
