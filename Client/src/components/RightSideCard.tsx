import React from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Link } from 'react-router-dom';

interface RightSideCardProps {
  children: React.ReactNode;
  title: string;
  viewMore?: string;
}

export default function RightSideCard({
  children,
  title,
  viewMore,
}: RightSideCardProps) {
  return (
    <div className='dark:border-slate-800 bg-white dark:bg-slate-950 rounded-lg border-l-2 border-l-slate-900 dark:border-l-slate-700'>
      <div className='py-2 pl-2 flex text-sm items-center justify-between'>
        <span className='font-semibold'>{title}</span>
        {viewMore && (
          <Link to={viewMore}>
            <Button variant={'link'}>Se mer</Button>
          </Link>
        )}
      </div>
      <Separator className='' />
      {children}
    </div>
  );
}
