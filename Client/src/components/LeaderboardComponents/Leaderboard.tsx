import { TableRow, TableCell, TableBody, Table } from '@/components/ui/table';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Separator } from '../ui/separator';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GiCrown } from 'react-icons/gi';
import { useEffect, useState } from 'react';
import LeaderboardSlider from './LeaderboardSlider';
import { ScrollArea } from '../ui/scroll-area';
import UserprofileHovercard from '../ProfileComponents/UserprofileHovercard';
import { Link } from 'react-router-dom';

import HoverProfileCardWithChildren from '../ProfileComponents/HoverProfileCardWithChildren';

export default function LeaderBoard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [active, setActive] = useState<tabs>('weekly');

  const { data: leaderboard, isLoading } = useQuery<leaderboardStandings[]>({
    queryKey: ['leaderboard', active],
    queryFn: getLeaderboard,
  });

  async function getLeaderboard() {
    const token = await getToken();

    const res = await axios.get(
      `http://localhost:3000/api/leaderboard/${active}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  }

  const [combinedLeaderboard, setCombinedLeaderboard] = useState<
    leaderboardStandings[]
  >([]);

  useEffect(() => {
    // append some fake data to the leaderboard so we can test the UI
    if (leaderboard) {
      const fakeData: leaderboardStandings[] = [
        {
          UserId: '3',
          TotalAccuracyScore: 0,
          WeeklyAccuracyScore: 0,
          MonthlyAccuracyScore: 0,
          YearlyAccuracyScore: 0,
          User: {
            first_name: 'John',
            last_name: 'Doe',
            username: 'johndoe',
            image_url:
              'https://static.printler.com/cache/e/f/0/c/6/c/ef0c6c257aa3d8b6fa14c82491ddd205c619215d.jpg',
          },
        },
        {
          UserId: '4',
          TotalAccuracyScore: 0,
          WeeklyAccuracyScore: 0,
          MonthlyAccuracyScore: 0,
          YearlyAccuracyScore: 0,
          User: {
            first_name: 'Jane',
            last_name: 'Doe',
            username: 'janedoe',
            image_url: '',
          },
        },
        {
          UserId: '5',
          TotalAccuracyScore: 0,
          WeeklyAccuracyScore: 0,
          MonthlyAccuracyScore: 0,
          YearlyAccuracyScore: 0,
          User: {
            first_name: 'John',
            last_name: 'Smith',
            username: '',
            image_url: '',
          },
        },
        {
          UserId: '6',
          TotalAccuracyScore: 0,
          WeeklyAccuracyScore: 0,
          MonthlyAccuracyScore: 0,
          YearlyAccuracyScore: 0,
          User: {
            first_name: 'Jane',
            last_name: 'Smith',
            username: '',
            image_url: '',
          },
        },
        {
          UserId: '7',
          TotalAccuracyScore: 0,
          WeeklyAccuracyScore: 0,
          MonthlyAccuracyScore: 0,
          YearlyAccuracyScore: 0,
          User: {
            first_name: 'John',
            last_name: 'Doe',
            username: '',
            image_url: '',
          },
        },
        {
          UserId: '8',
          TotalAccuracyScore: 0,
          WeeklyAccuracyScore: 0,
          MonthlyAccuracyScore: 0,
          YearlyAccuracyScore: 0,
          User: {
            first_name: 'Jane',
            last_name: 'Doe',
            username: '',
            image_url: '',
          },
        },
      ];

      setCombinedLeaderboard([...leaderboard, ...fakeData]);
    }
  }, [leaderboard]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (combinedLeaderboard.length < 3) {
    return <div>Not enough data to display the leaderboard.</div>;
  }

  function handleSlideChange(tabName: tabs) {
    console.log(tabName);
    setActive(tabName);
    queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
  }

  return (
    <div className='dark:border-slate-800 bg-white   '>
      <LeaderboardSlider active={active} setActive={handleSlideChange} />
      <Separator className='bg-gradient-to-r from-slate-950 via-slate-400 to-slate-950 my-1' />
      <div className='p-2 flex justify-center items-end relative'>
        <div className='flex flex-col items-center z-10 mr-[-10%]  '>
          <span className='text-center font-bold mb-2'>2</span>

          {/* <Avatar className='h-20 w-20 border-2 border-slate-600'>
            <AvatarImage src={combinedLeaderboard[1].User.image_url} />
            <AvatarFallback>..</AvatarFallback>
          </Avatar> */}

          <HoverProfileCardWithChildren User={combinedLeaderboard[1].User}>
            <Link to={`/${combinedLeaderboard[1].UserId}`}>
              <Avatar className='h-20 w-20 border-2 border-slate-600'>
                <AvatarImage src={combinedLeaderboard[1].User.image_url} />
                <AvatarFallback>..</AvatarFallback>
              </Avatar>
            </Link>
          </HoverProfileCardWithChildren>

          <span>{combinedLeaderboard[1].WeeklyAccuracyScore}</span>
        </div>

        <div className='flex flex-col items-center mx-8 z-20'>
          <span className='text-center font-bold'>1st</span>
          <GiCrown className='text-green-400 text-4xl' />

          <HoverProfileCardWithChildren User={combinedLeaderboard[0].User}>
            <Link to={`/${combinedLeaderboard[0].UserId}`}>
              <Avatar className='h-24 w-24 border-2 border-amber-400 '>
                <AvatarImage src={combinedLeaderboard[0].User.image_url} />
                <AvatarFallback>---</AvatarFallback>
              </Avatar>
            </Link>
          </HoverProfileCardWithChildren>

          <span>{combinedLeaderboard[0].WeeklyAccuracyScore}</span>
        </div>

        <div className='flex flex-col items-center z-10 ml-[-10%]'>
          <span className='text-center font-bold mb-2'>3</span>

          <HoverProfileCardWithChildren User={combinedLeaderboard[2].User}>
            <Link to={`/${combinedLeaderboard[2].UserId}`}>
              <Avatar className='h-20 w-20 border-2 border-slate-600'>
                <AvatarImage src={combinedLeaderboard[2].User.image_url} />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Link>
          </HoverProfileCardWithChildren>
          <span>{combinedLeaderboard[2].WeeklyAccuracyScore}</span>
        </div>
      </div>

      <Separator className='bg-gradient-to-r from-slate-950 via-slate-400 to-slate-950' />

      <ScrollArea className='h-[300px] overflow-y-auto relative'>
        <Table className='w-full'>
          <TableBody>
            {combinedLeaderboard.map((standing, index) => {
              if (index < 3) {
                return;
              }
              if (standing.UserId === user?.id) {
                return (
                  <TableRow
                    key={index}
                    className='hover:bg-gray-200 dark:hover:bg-gray-900/20 transition-colors border-slate-600 bg-slate-900/20 dark:bg-slate-700/20'
                  >
                    <TableCell className='text-center font-medium'>
                      {index + 1}
                    </TableCell>
                    <TableCell className='font-medium'>
                      <UserprofileHovercard User={standing.User} />
                    </TableCell>
                    <TableCell className=''>
                      {standing.WeeklyAccuracyScore}
                    </TableCell>
                  </TableRow>
                );
              }

              return (
                <TableRow
                  key={index}
                  className='hover:bg-gray-200 dark:hover:bg-gray-900/20 transition-colors border-slate-600'
                >
                  <TableCell className='text-center font-medium'>
                    {index + 1}
                  </TableCell>
                  <TableCell className='font-medium'>
                    <UserprofileHovercard User={standing.User} />
                  </TableCell>
                  <TableCell className=''>
                    {standing.WeeklyAccuracyScore}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
