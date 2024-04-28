import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  ChatBubbleIcon,
  DotsHorizontalIcon,
  HeartIcon,
} from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import dayjs from 'dayjs';
dayjs().format();

import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/sv'; // load on demand
dayjs.locale('sv');
dayjs.extend(relativeTime);

import { useNavigate } from 'react-router-dom';

import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { DialogDemo } from '../CommentComponents/CreateCommentModal';

import UserprofileHovercard from '../ProfileComponents/UserprofileHovercard';
import PostPredictionPopover from './PostPredictionPopover';
import { FaCircle } from 'react-icons/fa6';

export default function PostV4({
  post,
  currentPrice,
  detailedView = false, // false means its on the timeline, true means its on the post page
  parentMode = false,
  feed = false,
}: {
  post: TimeLinePost2;
  detailedView?: boolean;
  currentPrice?: number;
  comment?: boolean;
  parentMode?: boolean;
  feed?: boolean;
}) {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  console.log(parentMode);
  // create a function that checks if the predictionMovement is positive or negative, it will start with a negative sign if its a negative movement, return 'down' for negative and 'up' for positive

  async function handleLikePost(event: React.MouseEvent<HTMLSpanElement>) {
    event.stopPropagation(); // Prevents the post from being clicked when the like button is clicked
    const token = await getToken();

    const res = await axios.post(
      `http://localhost:3000/api/posts/${post.id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  }

  function parseContent(content: string) {
    // Regular expression to find segments starting with $
    // This will match segments like $AAPL, considering them as separate tokens
    const regex = /(\$[a-zA-Z]+)/g;

    // Split content into tokens, keeping the special tokens intact
    const tokens = content.split(regex);

    return tokens.map((token, index) => {
      // Check if the token matches the special pattern
      if (token.match(regex)) {
        // Return the token with special styling
        return (
          <Button
            className='p-0 text-blue-700 dark:text-blue-300 text-md '
            variant={'link'}
            key={index}
          >
            {token}
          </Button>
        );
      }
      // Return normal text for non-special tokens
      return token;
    });
  }

  return (
    <Card
      onClick={() => {
        if (!detailedView) {
          navigate(`/post/${post.id}`);
        }
      }}
      className={`rounded-none ${parentMode ? 'mb-4' : ''}  ${
        !detailedView
          ? 'hover:bg-neutral-50/95 dark:hover:bg-slate-900/20 cursor-pointer'
          : ''
      } dark:border-none  `}
    >
      <CardHeader className='pb-4'>
        <CardTitle className='flex justify-between '>
          <span className='flex gap-3   '>
            <UserprofileHovercard User={post.authorObject} />
            <FaCircle className='w-1 h-1 mt-3 text-gray-500 dark:text-slate-400' />
            <p className='mt-[4px] dark:text-slate-500 text-gray-500 text-sm'>
              {dayjs().to(post.timestamp)}
            </p>
          </span>

          <div className=''>
            <DotsHorizontalIcon className=' cursor-pointer' />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className={`${parentMode ? '' : ''} pb-3 `}>
        <div className='flex text-lg  items-center gap-2 flex-wrap leading-tight'>
          {parentMode && <p> PARENT</p>}
          {parseContent(post.content)}
        </div>

        {post.gifUrl && <img src={post.gifUrl} alt='gif' />}
      </CardContent>
      {/* {post.gifUrl && (
        <CardContent>
          <img src={post.gifUrl} alt='gif' />
        </CardContent>
      )} */}
      {post.predictions && (
        <CardContent>
          <PostPredictionPopover post={post} currentPrice={currentPrice || 1} />
        </CardContent>
      )}
      <CardFooter
        className={`flex w-full justify-between py-2 ${
          parentMode ? '' : ''
        } py-2`}
      >
        <div className='flex items-center gap-8'>
          <span
            onClick={(event) => handleLikePost(event)}
            className={`flex  items-center gap-2 ${
              post.hasLiked ? '' : 'text-slate-300'
            } `}
          >
            <span className='text-md dark:hover:bg-slate-800 hover:bg-slate-200 rounded-full dark:text-slate-300 text-slate-500 font-bold '>
              <HeartIcon
                className={`h-7 w-7 transition duration-150 ease-in-out  hover:bg-red-500/10 rounded-full p-[4px] ${
                  post.hasLiked
                    ? 'fill-current text-red-600 scale-125' // Scaled up when liked
                    : 'hover:text-red-600 hover:scale-110' // Scale up slightly on hover when not liked
                }`}
              />
            </span>
            <span className='font-bold text-lg dark:text-slate-300 text-slate-500 '>
              {feed ? post.likesCount : post.likes?.length}
            </span>
          </span>

          <span
            onClick={(event) => {
              event.stopPropagation();
            }}
            className=' flex items-center gap-2 '
          >
            <DialogDemo post={post}>
              <span
                className={`flex items-center gap-2 ${
                  post.hasLiked ? '' : 'text-slate-300'
                } `}
                onClick={() => console.log('open comment modal')}
              >
                <span className='text-md text-md dark:hover:bg-slate-800 hover:bg-slate-200 rounded-full dark:text-slate-300 text-slate-500 font-bold'>
                  <ChatBubbleIcon
                    className={`h-7 w-7 transition duration-150 ease-in-out  hover:bg-red-500/10 rounded-full p-[4px] ${
                      post.hasLiked
                        ? 'fill-current hover:text-blue-600 scale-125' // Scaled up when liked
                        : 'hover:text-blue-600 hover:scale-110' // Scale up slightly on hover when not liked
                    }`}
                  />
                </span>
                <span className='font-bold text-lg dark:text-slate-300 text-slate-500'>
                  {feed ? post.commentsCount : post.children?.length}
                </span>
              </span>
            </DialogDemo>
          </span>
        </div>
      </CardFooter>
      <Separator className='mt-2' />
    </Card>
  );
}
