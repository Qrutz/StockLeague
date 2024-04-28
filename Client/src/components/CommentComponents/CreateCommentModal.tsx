import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { SubmitHandler, useForm } from 'react-hook-form';

const predictionMovementConverter = (predictionMovement: number) => {
  if (predictionMovement < 0) {
    return 'down';
  } else {
    return 'up';
  }
};

function formatDate(dateString: string) {
  const date = new Date(dateString);

  const day = date.toLocaleDateString('en-GB', { day: '2-digit' });
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  const year = date.toLocaleDateString('en-GB', { year: 'numeric' });

  const suffix =
    ['st', 'nd', 'rd'][(((Number(day) % 30) + 90) % 30) - 1] || 'th';

  return `${day}${suffix} ${month}, ${year}`;
}

interface Inputs {
  comment: string;
}

export function DialogDemo({
  post,
  children,
}: {
  post: TimeLinePost2;
  children: React.ReactNode;
}) {
  const { getToken } = useAuth();
  const { register, handleSubmit } = useForm<Inputs>();

  const handleSubmitComment: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    const token = await getToken();

    const res = await axios.post(
      `http://localhost:3000/api/posts/${post.id}/comments`,
      {
        content: data.comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res.data);
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='bg-[#1A1A1A] text-white rounded-lg p-0 '>
        <Separator />
        <Card className='bg-[#1A1A1A] border-none '>
          {post.predictions && (
            <>
              <div className=' border-gray-700 p-4 flex'>
                <img
                  alt='Avatar'
                  className='rounded-full w-10 h-10 mr-2'
                  src={post.authorObject.image_url}
                />
                <div>
                  <p className='font-bold'>
                    {post.authorObject.first_name} {post.authorObject.last_name}{' '}
                    <span className='text-blue-500'>
                      @{post.authorObject.username}
                    </span>
                    <span className='text-gray-500'></span>
                  </p>

                  <div className='flex text-md  items-center gap-2 flex-wrap leading-tight mt-2'>
                    <span>jag tror att </span>
                    <Button
                      variant={'outline'}
                      size={'sm'}
                      className='hover:bg-slate-300 flex items-center text-md font-bold '
                    >
                      {' '}
                      {/* {post.predictions.ticker}{' '} */}
                    </Button>
                    kommer gå{' '}
                    <Button
                      variant={'outline'}
                      size={'sm'}
                      className=' hover:bg-slate-300 flex items-center gap-2 font-bold py-1 px-2'
                    >
                      <span className='text-md'>
                        {' '}
                        {predictionMovementConverter(
                          post.predictions.predictedMovement
                        )}
                      </span>
                      <span className='font-bold text-md'>
                        {post.predictions.predictedMovement}%
                      </span>{' '}
                    </Button>{' '}
                    tills{' '}
                    <Button
                      variant={'outline'}
                      size={'sm'}
                      className='hover:bg-slate-300 flex items-center text-md font-bold py-1 px-2'
                    >
                      {formatDate(post.predictions.dateAtGuess)}
                    </Button>
                  </div>
                </div>
              </div>
              <Separator />
              <form
                onSubmit={handleSubmit(handleSubmitComment)}
                className='p-4'
              >
                <div className='flex items-center space-x-1 mb-4'>
                  <img
                    alt='Replying to'
                    className='w-8 h-8 rounded-full'
                    src={post.authorObject.image_url}
                  />
                  <span className='text-gray-500 text-sm'>Replying to</span>
                  <a className='text-blue-500 text-sm' href='#'>
                    @{post.authorObject.username}
                  </a>
                </div>

                <Textarea
                  {...register('comment')}
                  placeholder='No you are retarded'
                  rows={4}
                />

                <div className='flex space-x-4'>
                  {/* Insert icons or additional content here */}
                </div>
                <DialogFooter className='flex justify-between items-center  p-4   border-gray-700'>
                  <div className='flex space-x-4'>
                    {/* Insert icons or additional content here */}
                  </div>
                  <Button
                    onClick={handleSubmit(handleSubmitComment)}
                    className='bg-blue-500 text-white px-4 py-2 rounded-full'
                  >
                    Reply
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
}
