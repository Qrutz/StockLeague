import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  int,
  mysqlTable,
  serial,
  varchar,
} from 'drizzle-orm/mysql-core';

// export const users = mysqlTable("users", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 256 }).notNull(),
//   email: varchar("email", { length: 256 }).notNull().unique(),
// });

// export const usersRelations = relations(users, ({ many }) => ({
//   posts: many(posts),
// }));s

export const users = mysqlTable('users', {
  userId: varchar('userId', { length: 256 }).unique().primaryKey().notNull(),
  first_name: varchar('first_name', { length: 256 }),
  last_name: varchar('last_name', { length: 256 }),
  email: varchar('email', { length: 256 }).unique(),
  username: varchar('username', { length: 256 }).unique(),
  image_url: varchar('profile_image_url', { length: 256 }),
  createdAt: varchar('createdAt', { length: 256 }),
  bio: varchar('bio', { length: 256 }),
  twitter_url: varchar('twitter_url', { length: 256 }),
});

export const followers = mysqlTable('followers', {
  id: serial('id').primaryKey(), // A unique identifier for each relationship
  follower_id: varchar('follower_id', { length: 256 })
    .notNull()
    .references(() => users.userId),
  followee_id: varchar('followee_id', { length: 256 })
    .notNull()
    .references(() => users.userId),
  created_at: varchar('created_at', { length: 256 }), // Optional: to track when the follow happened
});

//
export const userRelations = relations(users, ({ many }) => ({
  followers: many(followers, { relationName: 'followers' }),
  following: many(followers, { relationName: 'following' }),
}));

export const followersRelations = relations(followers, ({ one }) => ({
  follower: one(users, {
    fields: [followers.follower_id],
    references: [users.userId],
    relationName: 'following',
  }),

  user: one(users, {
    fields: [followers.followee_id],
    references: [users.userId],
    relationName: 'followers',
  }),
}));
