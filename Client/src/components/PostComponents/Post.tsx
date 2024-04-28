import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { DotsHorizontalIcon, HeartIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Separator } from '../ui/separator';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { DialogDemo } from '../CommentComponents/CreateCommentModal';

import UserprofileHovercard from '../ProfileComponents/UserprofileHovercard';
import {
  calculateAccuracy,
  calculateDaysLeft,
  formatDate,
  getStockMovementPercentage,
} from '@/lib/postFunctions';

export default function Post({
  post,
  currentPrice,
}: {
  post: TimeLinePost2;
  detailedView?: boolean;
  currentPrice?: number;
}) {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // create a function that checks if the predictionMovement is positive or negative, it will start with a negative sign if its a negative movement, return 'down' for negative and 'up' for positive
  const predictionMovementConverter = (predictionMovement: number) => {
    if (predictionMovement < 0) {
      return 'down';
    } else {
      return 'up';
    }
  };

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

  const stockMovementPercentage = getStockMovementPercentage(
    post.predictions.priceAtGuess,
    currentPrice
  );
  const accuracy = calculateAccuracy(
    post.predictions.predictedMovement,
    post.predictions.priceAtGuess,
    currentPrice
  );
  const daysLeft = calculateDaysLeft(
    post.predictions.dateAtFinal,
    post.predictions.dateAtGuess
  );

  return (
    <Card
      onClick={() => {
        navigate(`/post/${post.id}`);
      }}
      className='rounded-none border-none  z-[10] hover:bg-neutral-50/95 dark:hover:bg-slate-900/20 cursor-pointer dark:border-none '
    >
      <CardHeader>
        <CardTitle className='flex justify-between'>
          <UserprofileHovercard User={post.authorObject} />

          <div className=''>
            <DotsHorizontalIcon className=' cursor-pointer' />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex text-md  items-center gap-2 flex-wrap leading-tight'>
          <span>I think </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={'sm'}
                  className='hover:bg-slate-300 flex items-center text-lg font-bold '
                >
                  {' '}
                  {post.predictions.ticker}{' '}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          will go{' '}
          <Button
            variant={'outline'}
            size={'sm'}
            className=' hover:bg-slate-300 flex items-center gap-2 font-bold py-1 px-2'
          >
            <span className='text-md'>
              {' '}
              {predictionMovementConverter(post.predictions.predictedMovement)}
            </span>
            <span className='font-bold text-md'>
              {post.predictions.predictedMovement}%
            </span>{' '}
          </Button>{' '}
          till{' '}
          <Button
            variant={'outline'}
            size={'sm'}
            className='hover:bg-slate-300 flex items-center text-md font-bold py-1 px-2'
          >
            {formatDate(post.predictions.dateAtFinal)}
          </Button>
        </div>
      </CardContent>

      <CardContent className='flex-wrap'>
        <p
          className='leading-7 [&:not(:first-child)]:mt-6'
          style={{ maxWidth: '100%', wordWrap: 'break-word' }}
        >
          {post.content}
        </p>
      </CardContent>

      <CardContent>
        <section className='flex flex-col border-slate-600 border border-dotted rounded-lg'>
          <div className='flex justify-around p-2'>
            <div className='gap-1 flex flex-col'>
              <p className='text-xs font-thin  '>Price at guess:</p>
              <p className='text-xl font-bold'>
                {' '}
                ${Number(post.predictions.priceAtGuess).toFixed(2)}
              </p>
            </div>
            <div className='gap-1 flex flex-col'>
              <p className='text-xs font-thin  '>Current price:</p>
              <p className='text-xl font-bold'>${currentPrice?.toFixed(2)}</p>
            </div>
            <div className='gap-1 flex flex-col'>
              <p className='text-xs font-thin  '>Movement:</p>

              {stockMovementPercentage === undefined ? (
                <p className='text-xl font-bold text-gray-500'>Loading...</p>
              ) : (
                <div
                  className={`text-xl font-extrabold ${
                    stockMovementPercentage >= 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {stockMovementPercentage > 0 ? (
                    <div className='flex items-center gap-1'>
                      {/* <FaArrowUp className='text-green-500' /> */}
                      <span className='font-bold text-md'>
                        {stockMovementPercentage?.toFixed(2)}%
                      </span>
                    </div>
                  ) : (
                    <div className='flex items-center gap-1'>
                      {/* <FaArrowDown className='text-red-500' /> */}
                      <span className='font-bold text-md'>
                        {stockMovementPercentage?.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div
            className={`px-2 py-1 dark:bg-slate-600/10 ${
              accuracy && accuracy > 0 ? 'bg-green-300' : 'bg-red-200'
            }`}
          >
            <div className='container mx-auto md:max-w-3xl justify-between flex'>
              {accuracy && accuracy > 0 ? (
                <span className='font-bold text-green-500'>
                  {accuracy.toFixed(2)}% Accuracy
                </span>
              ) : (
                <span className='font-bold text-red-500'>
                  {accuracy?.toFixed(2)}% Accuracy
                </span>
              )}

              <span className='font-bold'>
                {daysLeft?.toFixed(0) + ' '}
                Days left
              </span>
            </div>
          </div>
        </section>
      </CardContent>

      <CardFooter className='flex w-full justify-between py-2'>
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
              {post.likesCount}
            </span>
          </span>

          <span
            onClick={(event) => {
              event.stopPropagation();
            }}
            className=' flex items-center gap-2 '
          >
            <DialogDemo post={post} />
          </span>
        </div>
      </CardFooter>
      <Separator className='mt-2' />
    </Card>
  );
}
