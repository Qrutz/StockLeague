import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import './ProfileStylesHelper.css';
import { useSearchParams } from 'react-router-dom';
import ProfilePostsList from '../ProfilePostsList';
import ProfileLikesList from './ProfileLikesList';

type tabs = 'posts' | 'likes' | 'watchlist' | 'portfolio';

export default function ProfileSortBySlider() {
  const [activeTab, setActiveTab] = useState<tabs>('posts');
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (value: tabs) => {
    setActiveTab(value);

    // Update the URL with currenturl/{value}
    setSearchParams({ tab: value });
  };

  useEffect(() => {
    // Get the tab value from the URL
    const tab = searchParams.get('tab') as tabs;
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Function to generate class names conditionally
  const getTabClassName = (tabValue: tabs) => {
    const baseClasses =
      'relative w-full h-full flex items-center justify-center rounded-none pt-0 mt-0 bg-slate-950 hover:bg-slate-900';
    const activeClasses = 'active-tab'; // Class for active tab
    return `${baseClasses} ${activeTab === tabValue ? activeClasses : ''}`;
  };
  return (
    <Tabs
      onValueChange={handleChange as (value: string) => void}
      value={activeTab}
      className='text-slate-400 p-0 m-0 '
    >
      <TabsList className='w-full flex justify-between rounded-none p-0 m-0 bg-slate-900 border-b border-slate-800 border-l'>
        <TabsTrigger className={getTabClassName('posts')} value='posts'>
          Posts
        </TabsTrigger>
        <TabsTrigger className={getTabClassName('likes')} value='likes'>
          Likes
        </TabsTrigger>
        <TabsTrigger className={getTabClassName('watchlist')} value='watchlist'>
          Watchlist
        </TabsTrigger>
        <TabsTrigger className={getTabClassName('portfolio')} value='portfolio'>
          Portfolio
        </TabsTrigger>
      </TabsList>
      <TabsContent className='p-0 m-0' value='posts'>
        <ProfilePostsList />{' '}
      </TabsContent>
      <TabsContent className='p-0 m-0' value='likes'>
        <ProfileLikesList />
      </TabsContent>
      <TabsContent value='watchlist'>watchlist </TabsContent>
      <TabsContent value='password'>Change your password here.</TabsContent>
    </Tabs>
  );
}
