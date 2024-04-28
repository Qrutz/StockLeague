import Comment from '@/components/CommentComponents/Comment';
import PostCreatorv2 from '@/components/EDITOR/PostCreator';
import PostV4 from '@/components/PostComponents/PostV4';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { pusherClient } from '@/lib/pusher';
import useStore from '@/stores/StockPricesStore';
import { useAuth, useUser } from '@clerk/clerk-react';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Link, useParams } from 'react-router-dom';

interface Inputs {
  comment: string;
}

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<Inputs>();
  const { updateSubscriptions } = useWebSocket();
  const { stockPrices } = useStore();

  console.log(id);

  const { data: detailedPost, isLoading } = useQuery<TimeLinePost2>({
    queryKey: ['post', { id }],
    queryFn: getDetailedPost,
  });

  async function getDetailedPost() {
    const token = await getToken();
    const res = await axios.get(`http://localhost:3000/api/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  }

  async function createComment(data: Inputs) {
    const token = await getToken();
    const res = await axios.post(
      `http://localhost:3000/api/posts/${id}/comments`,
      {
        content: data.comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data;
  }

  useEffect(() => {
    if (detailedPost) {
      // updateSubscriptions([detailedPost.predictions.ticker]);
    }
  }, [detailedPost, updateSubscriptions]);

  useEffect(() => {
    console.log('Subscribing to post channel: ' + id);
    const channel = pusherClient.subscribe(`post-${id}`);

    // @ts-expect-error asdfsf
    channel.bind('new-comment', function (data) {
      console.log('New comment:', data);
      // @ts-expect-error asdfsf
      queryClient.invalidateQueries(['post', { id }]);
    });
    // @ts-expect-error asdfsf
    channel.bind('like-event', function (data) {
      console.log('Like event:', data);
      // @ts-expect-error asdfsf
      queryClient.invalidateQueries(['post', { id }]);
    });

    return () => {
      console.log('Unsubscribing from post channel: ' + id);
      channel.unbind('new-comment');
      channel.unbind('like-event');
      pusherClient.unsubscribe(`post-${id}`);
    };
  }, [id, queryClient]);

  if (isLoading) {
    return <div>loading</div>;
  }

  console.log(detailedPost);

  return (
    <div className='flex flex-col'>
      <div
        className='p-2 items-center bg-white border-b dark:bg-slate-950 dark:border-slate-800  
      '
      >
        <Link to={`/home/`}>
          <Button className='flex gap-1 ' variant={'link'}>
            <ArrowLeftIcon className='w-6 h-6' />
            <span className='text-md font-bold'>Back</span>
          </Button>
        </Link>
      </div>

      {/* ---------------------- PARENT OF CURRENT POST ------------------------ */}
      <div className={`${detailedPost?.parent ? '' : ' '}`}>
        {detailedPost?.parent && (
          <PostV4 parentMode post={detailedPost.parent} />
        )}
      </div>

      {/* ---------------------- THE ACTUAL POST ------------------------ */}
      {detailedPost ? (
        <PostV4 currentPrice={2} post={detailedPost} detailedView={true} />
      ) : (
        <div>Post not found</div>
      )}

      <PostCreatorv2 commentMode={true} />

      {/* ---------------------- COMMENTS TO ACTUAL POST ------------------------ */}
      <div className='mb-4 dark:mb-0'></div>
      {detailedPost?.children ? (
        detailedPost.children.map((comment) => (
          <PostV4 key={comment.id} post={comment} comment={true} />
        ))
      ) : (
        <div> No comments yet</div>
      )}
    </div>
  );
}
