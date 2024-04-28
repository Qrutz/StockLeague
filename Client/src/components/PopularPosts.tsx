import { TableRow, TableCell, TableBody, Table } from '@/components/ui/table';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

import { Separator } from './ui/separator';

export default function PopularPosts() {
  return (
    <div className='dark:border-slate-800 border rounded-xl '>
      <div className='p-2 text-lg font-bold'>Populära inlägg</div>
      <Separator className='bg-gradient-to-r from-slate-950 via-slate-400 to-slate-950' />
      <Table className='w-full  '>
        <TableBody>
          <TableRow className='hover:bg-gray-200 dark:hover:bg-gray-900/20 transition-colors'>
            <TableCell className='text-center font-medium'>1</TableCell>
            <TableCell className='font-medium'>
              <div className='flex items-center gap-2'>
                <Avatar>
                  <AvatarImage alt='@username1' src='/placeholder-avatar.jpg' />
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
                <Link className='text-blue-500 hover:underline' to='#'>
                  @username1
                </Link>
              </div>
            </TableCell>
            <TableCell className=''>1500</TableCell>
          </TableRow>
          <TableRow className='hover:bg-gray-200 dark:hover:bg-gray-900/20 transition-colors'>
            <TableCell className='text-center font-medium'>2</TableCell>
            <TableCell className='font-medium'>
              <div className='flex items-center gap-2'>
                <Avatar>
                  <AvatarImage alt='@username2' src='/placeholder-avatar.jpg' />
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>
                <Link className='text-blue-500 hover:underline' to='#'>
                  @username2
                </Link>
              </div>
            </TableCell>
            <TableCell className=''>1400</TableCell>
          </TableRow>
          <TableRow className='hover:bg-gray-200 dark:hover:bg-gray-900/20 transition-colors'>
            <TableCell className='text-center font-medium'>3</TableCell>
            <TableCell className='font-medium'>
              <div className='flex items-center gap-2'>
                <Avatar>
                  <AvatarImage alt='@username3' src='/placeholder-avatar.jpg' />
                  <AvatarFallback>U3</AvatarFallback>
                </Avatar>
                <Link className='text-blue-500 hover:underline' to='#'>
                  @username3
                </Link>
              </div>
            </TableCell>
            <TableCell className=''>1300</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
