import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { TickerCombobox } from '../TickerCombobox';

export default function FeedSorter() {
  const [activeTab, setActiveTab] = useState<feed>('popular'); // Removed the TypeScript annotation for simplicity
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const option = searchParams.get('feed') as feed;

    // Simplified conditional logic
    setActiveTab(option || 'popular');
  }, [searchParams]);

  const handleChange = (value: feed) => {
    setActiveTab(value);
    setSearchParams({ feed: value });
  };

  return (
    <div className='flex flex-col bg-white dark:bg-slate-950 border-b dark:border-b-slate-700 sticky top-0 '>
      <div className='flex dark:text-white  border-b dark:bg-slate-950  dark:border-slate-800 '>
        <div className='flex justify-evenly w-full'>
          {['for-you', 'popular'].map((tab) => (
            <div
              key={tab}
              className='relative  cursor-pointer w-full flex justify-center transition duration-150 ease-in-out'
              onClick={() => handleChange(tab as feed)}
              style={{ padding: '8px 0' }} // Reduced padding here for less height
            >
              <a
                className={`text-sm ${
                  activeTab === tab ? 'font-bold' : 'font-semibold'
                }`}
              >
                {tab === 'for-you' ? 'For you' : 'Global feed'}
              </a>
              <div
                className={`absolute bottom-0 mx-auto h-[2px] w-full bg-blue-500 ${
                  activeTab === tab ? 'visible' : 'invisible'
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <div className='p-3 flex space-x-2 justify-between'>
        <span className='flex space-x-2 '>
          <Badge className='cursor-pointer'>All</Badge>
          <Badge
            variant={'outline'}
            className='hover:bg-neutral-100 cursor-pointer'
          >
            Watchlist
          </Badge>
          <Badge
            variant={'outline'}
            className='hover:bg-neutral-100 cursor-pointer'
          >
            Trending
          </Badge>
        </span>

        <TickerCombobox />
      </div>
    </div>
  );
}
