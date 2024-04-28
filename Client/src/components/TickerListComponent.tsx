import { ArrowUpIcon } from '@radix-ui/react-icons';

interface TickerListitemProps {
  ticker: string;
  companyName: string;
  currentPrice: string | number;
  ranking: number;
  movement: number;
}

export default function TickerListitem({
  ticker,
  companyName,
  currentPrice,
  ranking,
  movement,
}: TickerListitemProps) {
  const isPositiveMovement = movement > 0;

  return (
    <div className='flex items-center space-x-4 cursor-pointer bg-white dark:bg-slate-900 dark:hover:bg-slate-800 px-2 py-1  hover:bg-gray-200 transition-colors'>
      <div className='flex items-center justify-center rounded-full bg-gray-200 h-7 w-7 text-sm font-semibold'>
        {ranking}
      </div>
      <div className='flex flex-col'>
        <span className='font-bold text-md'>{ticker}</span>
        <span className='text-xs text-gray-500'>{companyName}</span>
      </div>
      {/* Conditionally render the icon and text color based on movement */}
      <div
        className={`${isPositiveMovement ? 'text-green-500' : 'text-red-500'}`}
      >
        <LineChartIcon
          className={`h-6 w-10 ${
            isPositiveMovement ? 'text-green-500' : 'text-red-500'
          }`}
        />
      </div>
      <div className='flex flex-col'>
        <span className='font-bold text-md'>
          {Number(currentPrice).toFixed(2)}
        </span>
        <span
          className={`flex items-center text-xs font-semibold ${
            isPositiveMovement ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPositiveMovement ? (
            <ArrowUpIcon className='h-4 w-4' />
          ) : (
            <ArrowDownIcon className='h-4 w-4' />
          )}
          {Number(movement).toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

function ArrowDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M12 5v14' />
      <path d='m19 12-7 7-7-7' />
    </svg>
  );
}

function LineChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M3 3v18h18' />
      <path d='m19 9-5 5-4-4-3 3' />
    </svg>
  );
}
