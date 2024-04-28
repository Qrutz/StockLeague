import { useClerk, useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandItem, CommandList } from '../ui/command';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

export default function UserProfileCard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  function handleSignout() {
    signOut().then(() => {
      navigate('/');
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className='flex dark:hover:bg-slate-800 dark:hover:text-slate-50 hover:bg-slate-200/90 justify-center md:justify-start  cursor-pointer  rounded-xl py-3  px-2  items-center space-x-2'>
          <img
            alt='Profile'
            className='h-10 w-10 rounded-full'
            height='40'
            src={user?.imageUrl}
            style={{
              aspectRatio: '40/40',
              objectFit: 'cover',
            }}
            width='40'
          />
          <div className='hidden md:block'>
            <div className='font-bold'>{user?.fullName}</div>
            <div className='text-xs text-gray-400'>
              {user?.username ? '@' + user.username : null}
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className=' mb-6 focus-visible:outline-none  p-4 focus:border-none  '>
        <Command className='rounded-lg w-[10rem] cursor-pointer    shadow-green-500/50     bg-gray-950 text-md shadow-md'>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {/* 
        <CommandItem className='hover:bg-slate-300 flex items-center py-4 px-2'>
          <PersonIcon className='mr-2 h-4 w-4' />
          <span>Profile</span>
        </CommandItem>
        <CommandItem className='hover:bg-slate-300 flex items-center py-4 px-2'>
          <EnvelopeClosedIcon className='mr-2 h-4 w-4' />
          <span>Mail</span>
        </CommandItem> */}
            <CommandItem>
              <Button
                className='hover:bg-[#1a1a1a] w-full  flex  py-4 px-2'
                onClick={handleSignout}
              >
                Logout
              </Button>
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
