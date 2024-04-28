import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { FaShare } from 'react-icons/fa';
import { FaHeart, FaMessage } from 'react-icons/fa6';
import { GiPieChart } from 'react-icons/gi';

export default function Comment({ comment }: { comment: Comment }) {
  return (
    <div className='w-full text-white py-4 px-2 pr-4 rounded-lg  mx-auto border-b border-slate-800'>
      <div className='flex items-start space-x-3 '>
        <Avatar className='mt-1'>
          <AvatarImage
            className='h-10 w-10 rounded-full'
            src={comment.authorObject.image_url}
          />
          <AvatarFallback>LS</AvatarFallback>
        </Avatar>
        <div className='flex-1  '>
          <div className='flex items-center justify-between'>
            <div>
              <p className='font-bold'>{comment.authorObject.first_name}</p>
              <p className='text-sm text-gray-400'>
                @{comment.authorObject.username}
              </p>
            </div>
            <DotsHorizontalIcon className='text-slate-300 w-6 h-6' />
          </div>
          <p className='mt-1'>{comment.content}</p>
          <div className='flex items-center justify-between  text-gray-400 text-sm mt-6'>
            <FaMessage className='w-6 h-6 text-slate-800' />

            <div className='flex items-center'>
              <FaHeart className='w-6 h-6 text-red-300' />
              <span className='ml-1'></span>
            </div>
            <div className='flex items-center'>
              <GiPieChart className='w-6 h-6 text-slate-800' />
              <span className='ml-1'></span>
            </div>
            <FaShare className='text-slate-800 w-6 h-6' />
          </div>
        </div>
      </div>
    </div>
  );
}
