import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  int,
  mysqlTable,
  serial,
  varchar,
} from 'drizzle-orm/mysql-core';

export const UserLeaderboard = mysqlTable('UserLeaderboard', {
  UserId: varchar('UserId', { length: 256 }).primaryKey().notNull(),
  TotalAccuracyScore: int('TotalAccuracyScore').notNull(),
  WeeklyAccuracyScore: int('WeeklyAccuracyScore').notNull(),
  MonthlyAccuracyScore: int('MonthlyAccuracyScore').notNull(),
  YearlyAccuracyScore: int('YearlyAccuracyScore').notNull(),
});

export const PostAccuracyDetails = mysqlTable('PostAccuracyDetails', {
  PostId: varchar('PostId', { length: 256 }).primaryKey().notNull(),
  UserId: varchar('UserId', { length: 256 }).primaryKey().notNull(),
  Ticker: varchar('Ticker', { length: 256 }).primaryKey().notNull(),
  PredictedMovement: bigint('PredictedMovement', { mode: 'number' }).notNull(),
  ActualMovement: bigint('ActualMovement', { mode: 'number' }).notNull(),
  AccuracyScore: int('AccuracyScore').notNull(),
  PredictionDate: varchar('PredictionDate', { length: 256 }).notNull(),
  EvaluatedDate: varchar('EvaluatedDate', { length: 256 }).notNull(), // Date post has been evaluted for accuracy.
});

export const LeaderboardHistory = mysqlTable('LeaderboardHistory', {
  RecordId: serial('RecordId').primaryKey().notNull(),
  UserId: varchar('UserId', { length: 256 }).notNull(),
  Date: varchar('Date', { length: 256 }).notNull(),
  AccuracyScore: int('AccuracyScore').notNull(),
  Rank: int('Rank').notNull(),
  // timeframe, which is either daily, weekyl, monthly, or yearly.
  Timeframe: varchar('Timeframe', { length: 256 }).notNull(),
});
