import { Separator } from '../ui/separator';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  getStockMovementPercentage,
  calculateAccuracy,
  calculateDaysLeft,
} from '@/lib/postFunctions';
import UserprofileHovercard from '../ProfileComponents/UserprofileHovercard';

export default function ProfilePost({
  post,
  currentPrice,
}: {
  post: DetailedPost;
  currentPrice?: number;
}) {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  async function handleLikePost(event: React.MouseEvent<SVGElement>) {
    event.stopPropagation();
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
    post.priceAtGuess,
    currentPrice
  );
  const accuracy = calculateAccuracy(
    post.predictedMovement,
    post.priceAtGuess,
    currentPrice
  );
  const daysLeft = calculateDaysLeft(post.dateAtFinal, post.dateAtGuess);

  return (
    <Card
      onClick={() => {
        navigate(`/post/${post.id}`);
      }}
      className='rounded-none z-[10] dark:hover:bg-slate-900/20 cursor-pointer '
    >
      <CardHeader>
        <CardTitle className='flex justify-between'>
          <UserprofileHovercard User={post.poster} />

          <div className=''>
            <DotsHorizontalIcon className=' cursor-pointer' />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex text-md  items-center gap-2 flex-wrap leading-tight'>
          <span>jag tror att </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={'sm'}
                  className='hover:bg-slate-300 flex items-center text-lg font-bold '
                >
                  {' '}
                  {post.ticker}{' '}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          kommer gå{' '}
          <Button
            variant={'outline'}
            size={'sm'}
            className=' hover:bg-slate-300 flex items-center gap-2 font-bold py-1 px-2'
          >
            <span className='text-md'>asdfasdf</span>
            <span className='font-bold text-md'>
              {post.predictedMovement}%
            </span>{' '}
          </Button>{' '}
          tills{' '}
          <Button
            variant={'outline'}
            size={'sm'}
            className='hover:bg-slate-300 flex items-center text-md font-bold py-1 px-2'
          >
            fff
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

      {/* <Separator className='' /> */}

      <CardContent>
        <section className='flex flex-col border-slate-600 border border-dotted rounded-lg'>
          <div className='flex justify-around p-2'>
            <div className='gap-1 flex flex-col'>
              <p className='text-xs font-thin  '>Price at guess:</p>
              <p className='text-xl font-bold'>
                {' '}
                ${Number(post.priceAtGuess).toFixed(2)}
              </p>
            </div>
            <div className='gap-1 flex flex-col'>
              <p className='text-xs font-thin  '>Current price:</p>
              <p className='text-xl font-bold'>${currentPrice?.toFixed(2)}</p>
              {/* <p className='text-xs text-[#94a3b8]'>
                updated at {new Date().toLocaleDateString()}
              </p> */}
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

          <div className='dark:bg-slate-600/10   px-2 py-1  '>
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

      <Separator className='' />

      <CardFooter className='flex w-full justify-between py-2'>
        <div className='flex items-center gap-10'>
          <span className={`flex items-center gap-2 `}>
            <span className='text-md'>
              <HeartIcon
                onClick={handleLikePost}
                className={`h-6 w-6 transition duration-150 ease-in-out cursor-pointer ${
                  post.hasLiked
                    ? 'fill-current text-red-600 scale-125' // Scaled up when liked
                    : 'hover:text-red-600 hover:scale-110' // Scale up slightly on hover when not liked
                }`}
              />
            </span>
            <span className='font-bold text-lg'>{post.likes.length}</span>
          </span>

          <span className={`flex items-center gap-2`}>
            <span className='text-md'>
              <ChatBubbleIcon
                className={`h-6 w-6 transition duration-150 ease-in-out `}
              />
            </span>
            <span className='font-bold text-lg'>{post.comments.length}</span>
          </span>
        </div>
      </CardFooter>
      <Separator className='mt-2' />

      {/* <section className='   flex flex-col p-4 space-y-3 '>
    <div className='flex items-center w-full gap-2 '>
      <Avatar className=' '>
        <AvatarImage
          className=' w-12 h-12 rounded-full'
          src={user?.imageUrl}
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className='w-full'>
        <Input
          className='w-full cursor-pointer border-gray-900 focus:outline-none active:border-none'
          placeholder='Vad tycker du om detta anon?'
        />
      </div>
    </div>
    <div className='flex flex-col gap-1'>
      <p>Alla kommentarer</p>
      <div className='comment p-2'>
        <div className='flex flex-row items-center gap-2'>
          <img
            alt='avatar'
            src='https://www.w3schools.com/howto/img_avatar.png'
            className='w-6 h-6 rounded-full'
          />
          <h3 className='text-sm dark:text-slate-300   '>John Doe</h3>
        </div>
        <p className='text-sm text-gray-500 ml-8 '>
          Completely mongoloid thinking, you are not going to make it in the
          stock market game and you should consider dollar averaging into an
          index fund retard.{' '}
        </p>
        <div className='mt-4 text-sm flex justify-between'>
          <span>Reply</span>
        </div>
      </div>
    </div>
  </section> */}
    </Card>
  );
}
