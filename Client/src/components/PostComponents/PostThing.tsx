import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

import { Separator } from '../ui/separator';

import { Button } from '../ui/button';
import { useAuth, useUser } from '@clerk/clerk-react';

import { API } from '@/API/config';
import axios from 'axios';

import CircleProgress from '../CharacterCounter';

import PostCreatorv2 from '../EDITOR/PostCreator';
interface Stock {
  symbol: string;
  name: string;
}

const fetchStocks = async (searchValue: string) => {
  console.log(
    'running fetch stocks function with search value: ' + searchValue
  );
  if (!searchValue.trim()) return []; // Return empty array if searchValue is empty

  const response = await axios.get(
    `${API}search-ticker?query=${searchValue}&limit=10&apikey=${
      import.meta.env.VITE_FMP_KEY
    }`
  );

  console.log(response.data);
  return response.data || [];
};

export default function PostThing() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <>
      <div className='flex z-[10] p-4  dark:border-b dark:bg-slate-950 bg-white dark:border-l rounded-md   dark:border-slate-700 gap-2 '>
        <Avatar className='h-12 w-12    '>
          <AvatarImage className='rounded-full' src={user.imageUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className='flex flex-col w-full '>
          <PostCreatorv2 />

          <Button variant={'ghost'} className='flex justify-start w-[] '>
            Add a prediction
          </Button>
          <Separator className=' my-1' />
          <div className='flex justify-between '>
            <span className='flex '>
              <Button variant={'ghost'}>📷</Button>
              <Button variant={'ghost'}>🎥</Button>
              <Button variant={'ghost'}>📊</Button>
            </span>

            <span className='flex gap-1 items-center '>
              <CircleProgress progress={33} max={280} />
              <Separator className=' rotate-90 w-6 bg-slate-500' />
              <Button
                variant={'default'}
                className='rounded-lg bg-blue-500 font-bold'
              >
                Post
              </Button>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
