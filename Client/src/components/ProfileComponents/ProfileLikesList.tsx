import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useStore from '@/stores/StockPricesStore';
import { useEffect } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import PostV4 from '../PostComponents/PostV4';

export default function ProfileLikesList() {
  const { getToken } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const { updateSubscriptions } = useWebSocket();
  const { stockPrices } = useStore();

  const { data: posts, isLoading } = useQuery<TimeLinePost2[]>({
    queryKey: ['posts', { userId }],
    queryFn: getPosts,
  });

  async function getPosts() {
    const token = await getToken();
    const res = await axios.get(
      `http://localhost:3000/api/posts/user/${userId}/likes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data;
  }

  useEffect(() => {
    if (posts) {
      // Extract unique tickers from posts
      // const tickers = posts
      //   .map((post) => post.ticker)
      //   .filter((v, i, a) => a.indexOf(v) === i);
      // updateSubscriptions(tickers);
    }
  }, [posts, updateSubscriptions]);

  if (isLoading) return <div>loading...</div>;

  console.log(posts);
  return (
    <>
      {posts?.map((post) => (
        <PostV4 key={post.id} post={post} currentPrice={2} />
      ))}
    </>
  );
}
