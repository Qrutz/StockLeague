type Stock = {
  name: string;
  symbol: string;
  price?: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type guess = {
  stock: Stock;
  movement: Movement;
  byDate: Date | Date[];
  description: string;
  postedBy: {
    name: string;
    imageUrl: string;
  };
  dateAtGuess: Date;
};

type Movement = {
  direction: string;
  percentage: string | number;
};

// type Prediction = {
//   priceAtGuess: number;
//   dateAtGuess: Date;
//   guess: guess;
// };

interface bankIdAuthResponse {
  bankIdIssueDate: string;
  device: {
    ipAddress: string;
    uhi: string;
  };
  user: {
    givenName: string;
    name: string;
    personalNumber: string;
    surname: string;
  };
}

interface Post {
  insertedPostId: number;
  id?: number;
  content: string;
  ticker: string;
  priceAtGuess: number;
  predictedMovement: number;
  dateAtGuess: string;
  dateAtFinal: string;
  userId: string;
  // accuracy: number;
  // daysLeftUntilFinal: number;
  // stockMovementPercentage: number;
  // currentStockPrice: number;
  poster: UserObject;
  likeCount?: number;
  hasLiked: number;
  commentCount?: number;
  hasCommented: number;
}

interface DetailedPost {
  id: number;
  content: string;
  ticker: string;
  priceAtGuess: number;
  predictedMovement: number;
  dateAtFinal: string;
  dateAtGuess: string;
  poster: UserObject;
  likes: {
    id: number;
    userId: string;
    timestamp: string;
  }[];
  hasLiked: boolean;
  comments: {
    id: number;
    userId: string;
    content: string;
    timestamp: string;
    authorData: {
      id: string;
      imageUrl: string;
      firstName: string;
      lastName: string;
      username: string;
    };
  }[];
}

type Like = {
  id: number;
  postId: number;
  userId: string;
  timestamp: string;
};

interface Comment {
  id: number;
  userId: string;
  content: string;
  timestamp: string;
  postId: number;
  authorData: UserObject;
}

interface leaderboardStandings {
  UserId: string;
  TotalAccuracyScore: number;
  WeeklyAccuracyScore: number;
  MonthlyAccuracyScore: number;
  YearlyAccuracyScore: number;
  User: UserObject;
}

type tabs = 'weekly' | 'monthly' | 'yearly';

type feed = 'popular' | 'for-you';

interface UserObject {
  userId: string;
  first_name: string;
  last_name: string;
  last_sign_in_at: string;
  email: string;
  username: string;
  updatedAt: string;
  image_url: string;
  createdAt: string;
  bio?: string;
  twitter_url?: string;
  following?: following[];
  followers?: following[];

  isFollowing?: boolean;
}

interface following {
  id: number;
  follower_id: string;
  followee_id: string;
  updatedAt: string;
}

interface TimeLinePost {
  id: number;
  content: string;
  ticker: string;
  priceAtGuess: number;
  predictedMovement: number;
  dateAtGuess: string;
  dateAtFinal: string;
  authorId: string;
  commentsCount: number;
  likesCount: number;
  hasLiked: boolean;
  authorObject: {
    userId: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    image_url: string;
    createdAt: string;
    bio: string;
    twitter_url: string;
  };
}

interface TimeLinePost2 {
  id: number;
  content: string;
  gifUrl: string;
  timestamp: string;
  children: TimeLinePost2[];
  parent?: TimeLinePost2;
  predictions: {
    // rename to prediction later cus we only ognna have one prediction
    dateAtFinal: string;
    dateAtGuess: string;
    id: number;
    priceAtGuess: number;
    predictedMovement: number;
    ticker: string;
  };
  commentsCount: number;
  likesCount: number;
  hasLiked: boolean;
  authorObject: {
    userId: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    image_url: string;
    createdAt: string;
    bio: string;
    twitter_url: string;
  };
  likes?: Like[];
  comments?: Comment[];
}
