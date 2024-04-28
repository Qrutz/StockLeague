import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { FaXTwitter } from 'react-icons/fa6';

import { SlSocialInstagram } from 'react-icons/sl';

import { FaFacebookF } from 'react-icons/fa';

import { Separator } from '../ui/separator';
import { Link } from 'react-router-dom';

interface Iprops {
  User: {
    userId: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    image_url: string;
    createdAt: string;
  };
}

export default function UserprofileHovercard({ User }: Iprops) {
  return (
    <HoverCard openDelay={500}>
      <HoverCardTrigger
        onClick={(event) => {
          event.stopPropagation();
        }}
        asChild
      >
        <Link
          to={`/user/${User.userId}`}
          className='flex items-center space-x-2 cursor-pointer'
        >
          <Avatar>
            <AvatarImage alt='@username3' src={User.image_url} />
            <AvatarFallback>U3</AvatarFallback>
          </Avatar>
          <div className='hover:underline'>
            <div className='font-bold'>
              {User.first_name} {User.last_name}
            </div>
            <div className='text-xs text-gray-400'>
              {User.username ? '@' + User.username : null}
            </div>
          </div>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className='w-80  '>
        <div className='flex  space-x-4 '>
          <Avatar className='cursor-pointer'>
            <AvatarImage src={User.image_url} />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className='space-y-2 '>
            <div className='font-bold cursor-pointer'>
              <div className=''>
                {User.first_name} {User.last_name}
              </div>
              <div className='text-xs text-gray-400'>
                {User.username ? '@' + User.username : null}
              </div>
            </div>
            <p className='text-sm'>I'm just a happy camper</p>
            <div className='flex items-center pt-2'>
              <FaXTwitter className='text-xl dark:bg-slate-950 dark:text-slate-100 cursor-pointer' />
              <Separator className='bg-gradient-to-r from-slate-950 via-slate-200 to-slate-950 rotate-90 w-8 ' />
              <FaFacebookF className='text-xl dark:bg-slate-950 dark:text-slate-100 cursor-pointer' />
              <Separator className='bg-gradient-to-r from-slate-950 via-slate-200 to-slate-950 rotate-90 w-8 ' />
              <SlSocialInstagram className='text-xl dark:bg-slate-950 dark:text-slate-100 cursor-pointer' />
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
