import { relations } from 'drizzle-orm';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

import {
  bigint,
  boolean,
  int,
  mysqlTable,
  serial,
  varchar,
} from 'drizzle-orm/mysql-core';

export const posts = mysqlTable('postsStorage', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  content: varchar('content', { length: 256 }).notNull(),
  userId: varchar('userId', { length: 256 }).notNull(),
  gifUrl: varchar('gifUrl', { length: 256 }),
  commentsCount: bigint('commentsCount', { mode: 'number' })
    .notNull()
    .default(0),
  likesCount: bigint('likesCount', { mode: 'number' }).notNull().default(0),
  timestamp: varchar('timestamp', { length: 256 }).notNull(),
});

export const predictions = mysqlTable('predictionsStorage', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  ticker: varchar('ticker', { length: 256 }).notNull(),
  postId: bigint('postId', { mode: 'number' })
    .notNull()
    .references(() => posts.id),
  userId: varchar('userId', { length: 256 }).notNull(),
  priceAtGuess: bigint('priceAtGuess', { mode: 'number' }).notNull(),
  predictedMovement: bigint('predictedMovement', { mode: 'number' }).notNull(),
  dateAtGuess: varchar('dateAtGuess', { length: 256 }).notNull(),
  dateAtFinal: varchar('dateAtFinal', { length: 256 }).notNull(),
});

// each post has many predictions
export const predictionsRelations = relations(predictions, ({ one }) => ({
  postsStorage: one(posts, {
    fields: [predictions.postId],
    references: [posts.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  predictions: one(predictions),
}));

export type InsertPost = InferInsertModel<typeof posts>;
export type InsertPrediction = InferInsertModel<typeof predictions>;
