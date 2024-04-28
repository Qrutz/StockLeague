interface Postv2 {
  id: number;
  content: string;
  ticker: string;
  priceAtGuess: number;
  predictedMovement: number;
  dateAtGuess: string;
  dateAtFinal: string;
  authorId: string;
}

interface postLikeEvent {
  postId: string;
  eventType: 'like' | 'unlike';
}

interface postCommentEvent {
  postId: string;
  eventType: 'comment' | 'uncomment';
}

interface Post {
  insertedPostId: number;
  content: string;
  ticker: string;
  priceAtGuess: number;
  predictedMovement: number;
  dateAtGuess: string;
  dateAtFinal: string;
  userId: string;
  accuracy?: number;
  daysLeftUntilFinal?: number;
  currentStockPrice?: number;
  stockMovementPercentage?: number;
  poster?: {
    id: string;
    imageUrl: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
  };
}

interface User {
  userId: string;
  first_name: string;
  last_name: string;
  email?: string;
  image_url: string;
  username: string;
  createdAt: string;
  bio?: string;
  twitter_url?: string;
}
