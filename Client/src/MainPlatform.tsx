import { useAuth } from '@clerk/clerk-react';
import Component from './components/LSidebar';
import './app.css';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import WebSocketProvider from './contexts/WebSocketContext';
import { SearchBar } from './components/SearchInput';
import { NavigationTopbar } from './components/NavbarTop';
import { Button } from './components/ui/button';
import LeaderBoardV2 from './components/LeaderboardComponents/Leaderboardv2';
import TrendingStocksCard from './components/TrendingStocksCard';
import { SortProvider } from './contexts/SortFilterContext';

function MainPlatform() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/');
    }
  }, [isSignedIn, navigate]);

  return (
    <WebSocketProvider>
      <SortProvider>
        <div className=' dark:bg-slate-950 bg-neutral-100    '>
          {/* remove container for full width */}
          <div className='flex  md:max-w-7xl  mx-auto justify-center          min-h-screen'>
            <Component />

            <div className='flex flex-col w-full'>
              <span className='bg-white border-b dark:bg-slate-950 dark:border-b-slate-700 p-3 flex space-x-2'>
                <SearchBar />
                <Button
                  variant={'default'}
                  className='bg-blue-500 hover:bg-blue-600 dark:bg-green-500 dark:hover:bg-green-600 dark:text-white  font-bold'
                >
                  Get premium
                </Button>
                <NavigationTopbar />
              </span>
              {/* <span className='bg-red-300 h-5'>banderoll</span> */}

              <div className='flex '>
                <main className=' md:w-[66%] w-full p-2 dark:p-0   '>
                  <Outlet />
                </main>

                <div className='  dark:border-slate-700 dark:border-l p-2  dark:bg-slate-950  gap-7 dark:text-slate-300 flex-1 hidden md:flex flex-col'>
                  <div className='w-full h-[100px]  border border-gray-200 rounded-lg flex items-center justify-center p-4 text-gray-500'>
                    <span className='text-sm font-semibold leading-none'>
                      Ad placeholder
                    </span>
                  </div>
                  <LeaderBoardV2 />
                  <TrendingStocksCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SortProvider>
    </WebSocketProvider>
  );
}

export default MainPlatform;
