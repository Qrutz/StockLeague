import { relations } from 'drizzle-orm';
import {
  AnyMySqlColumn,
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
// }));

export const posts = mysqlTable('posts', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  content: varchar('content', { length: 256 }).notNull(),
  userId: varchar('userId', { length: 256 }).notNull(),
  gifUrl: varchar('gifUrl', { length: 256 }),
  timestamp: varchar('timestamp', { length: 256 }).notNull(),
});

export const predictions = mysqlTable('predictions', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  postId: bigint('postId', { mode: 'number' })
    .notNull()
    .references(() => posts.id),
  ticker: varchar('ticker', { length: 256 }).notNull(),
  userId: varchar('userId', { length: 256 }).notNull(),
  priceAtGuess: bigint('priceAtGuess', { mode: 'number' }).notNull(),
  predictedMovement: bigint('predictedMovement', { mode: 'number' }).notNull(),
  dateAtGuess: varchar('dateAtGuess', { length: 256 }).notNull(),
  dateAtFinal: varchar('dateAtFinal', { length: 256 }).notNull(),
});

export const predictionsRelations = relations(predictions, ({ one }) => ({
  post: one(posts, {
    fields: [predictions.postId],
    references: [posts.id],
  }),
}));

export const post = mysqlTable('postsNestedTest', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement().notNull(),
  content: varchar('content', { length: 256 }).notNull(),
  userId: varchar('userId', { length: 256 }).notNull(),
  gifUrl: varchar('gifUrl', { length: 256 }),
  timestamp: varchar('timestamp', { length: 256 }).notNull(),
});

// export const postsNestedTestRelations = relations(postsNestedTest, ({ one, many }) => ({
//   comments: many(comments),
//   likes: many(likes),
//   predictions: one(predictions),
//

export const likes = mysqlTable('likes', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  postId: bigint('postId', { mode: 'number' }).notNull(),
  userId: varchar('userId', { length: 256 }).notNull(),
  timestamp: varchar('timestamp', { length: 256 }).notNull(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  comments: many(comments),
  likes: many(likes),
  predictions: one(predictions),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  // postnested: one(postsNestedTest, {
  //   fields: [likes.postId],
  //   references: [postsNestedTest.id],
  // }),
}));

export const comments = mysqlTable('comments', {
  id: serial('id').primaryKey(),
  content: varchar('content', { length: 256 }).notNull(),
  gifUrl: varchar('gifUrl', { length: 256 }),
  postId: bigint('postId', { mode: 'number' }).references(() => posts.id, {
    onDelete: 'cascade',
  }),
  userId: varchar('userId', { length: 256 }).notNull(),
  timestamp: varchar('timestamp', { length: 256 }).notNull(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));
