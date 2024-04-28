import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import FeedSorter from '@/components/TimelineComponents/FeedSorter';
import Post from '@/components/PostComponents/Post';
import PostModal from '@/components/TimelineComponents/PostModal';
import { Button } from '@/components/ui/button';
import { pusherClient } from '@/lib/pusher';
import useStore from '@/stores/StockPricesStore';
import { useWebSocket } from '@/contexts/WebSocketContext';
import PostCreatorV2 from '@/components/EDITOR/PostCreator';
import PostThing from '@/components/PostComponents/PostThing';
import PostCreatorv2 from '@/components/EDITOR/PostCreator';
import PostV4 from '@/components/PostComponents/PostV4';
import { useSort } from '@/hooks/useSort';
import { TickerType } from '@/contexts/SortFilterContext';

export default function Home() {
  const { getToken, userId } = useAuth();
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);
  const queryClient = useQueryClient();
  const { updateSubscriptions } = useWebSocket();
  const { stockPrices } = useStore();
  // const [stockPrices, setStockPrices] = useState<{ [ticker: string]: number }>(
  //   {}
  // );
  const { sort, updateSort } = useSort();
  const ticker = sort.ticker;

  console.log(sort);

  const { data: posts, isLoading } = useQuery<TimeLinePost2[]>({
    queryKey: ['timeline', { sort }, ticker], // ['globalTimeline
    queryFn: () => getTimeline(sort.type, ticker),
  });

  async function getTimeline(sortType: string, ticker?: TickerType) {
    const token = await getToken();
    // const res = await axios.get('http://localhost:3000/api/timeline/new-feed', {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    let url = `http://localhost:3000/api/timeline/${sortType}`;

    if (ticker) {
      url = `${url}?ticker=${ticker}`;
    }

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  }

  console.log(posts);

  useEffect(() => {
    const channel = pusherClient.subscribe('global-timeline');
    channel.bind('new-post', function (data: { authorId: string }) {
      if (data.authorId === userId) {
        // invalidate query
        queryClient.invalidateQueries({ queryKey: ['globalTimeline'] });
        return;
      }
      setNewPostsAvailable(true);
    });
    channel.bind(
      'new-like',
      function (data: { postId: number; userId: string }) {
        console.log(data);
        console.log(posts);

        // const updatedPosts = posts?.map((post) => {
        //   if (post.id === data.postId) {
        //     return { ...post, likeCount: post.likesCount + 1 };
        //   }
        //   return post;
        // });

        // // Update your state here
        // // If you're using `useQuery`, update the cache
        // queryClient.setQueryData(['globalTimeline'], updatedPosts);
        queryClient.invalidateQueries({ queryKey: ['timeline'] });
      }
    );

    channel.bind('new-comment', function () {
      queryClient.invalidateQueries({ queryKey: ['globalTimeline'] });
    });

    return () => {
      channel.unbind('new-post');
      channel.unbind('new-like');
      channel.unbind('new-comment');
      pusherClient.unsubscribe('global-timeline');
    };
  }, [posts, queryClient, userId]);

  useEffect(() => {
    if (posts) {
      // Extract unique tickers from posts
      // const tickers = posts
      //   .map((post) => post.predictions.ticker)
      //   .filter((v, i, a) => a.indexOf(v) === i);
      // updateSubscriptions(tickers);
    }
  }, [posts, updateSubscriptions]);

  useEffect(() => {
    document.title = 'AktieLigan';
  }, []);

  console.log(stockPrices);

  const fetchNewPosts = async () => {
    await queryClient.invalidateQueries({ queryKey: ['timeline'] });
    setNewPostsAvailable(false);
  };

  return (
    <div className='flex flex-col gap-1 dark:gap-0'>
      {/* <PostCreatorV2 /> */}
      <PostCreatorv2 />
      <div className='postsList'>
        <FeedSorter />
        {isLoading && <p>Loading...</p>}
        {newPostsAvailable && (
          <Button
            variant={'secondary'}
            onClick={fetchNewPosts}
            className='rounded-none w-full border-none shadow-none'
          >
            New Posts Available
          </Button>
        )}

        {posts?.map((post) => (
          <PostV4 feed key={post.id} post={post} currentPrice={2} />
        ))}
      </div>
    </div>
  );
}
