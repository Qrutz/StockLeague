import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface GifHandlerProps {
  children: React.ReactNode;
  // callback function to handle the selected gif
  onSelect: (gif: any) => void;
}

export default function GifHandler({ children, onSelect }: GifHandlerProps) {
  const {
    data: gifs,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['gifs', { q: 'trending' }],
    queryFn: getGifs,
  });
  const [isOpen, setIsOpen] = React.useState(false);
  async function getGifs() {
    const res = await axios.get(
      'https://api.giphy.com/v1/gifs/trending?api_key=x6BNpmv27ngZGaTO3zSLme5OA2wGavwH&limit=25&offset=0&rating=r&bundle=messaging_non_clips'
    );

    return res.data.data.map((gif: any) => ({
      ...gif,
      url: gif.images.original.url,
    }));
  }

  if (isLoading) return <div>loading...</div>;

  function handleSelect(gif: any) {
    onSelect(gif);

    // close the dialog
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent className='flex flex-col'>
        <div className='flex justify-between'>
          <h1 className='text-lg font-bold dark:text-white'>Gifs</h1>
          <AlertDialogCancel className='dark:text-white'>
            Cancel
          </AlertDialogCancel>
        </div>

        <ScrollArea className=' h-[34rem]'>
          <div className='grid grid-cols-3'>
            {gifs?.map((gif: any, index: number) => (
              <img
                key={index}
                onClick={() => handleSelect(gif)}
                className='h-full w-full transition duration-300 ease-in-out hover:scale-105 cursor-pointer'
                src={gif.url}
                alt={gif.title}
              />
            ))}
          </div>
        </ScrollArea>
      </AlertDialogContent>
    </AlertDialog>
  );
}
