import { TableRow, TableCell, TableBody, Table } from '@/components/ui/table';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import UserprofileHovercard from '../ProfileComponents/UserprofileHovercard';

import RightSideCard from '../RightSideCard';

export default function LeaderBoardV2() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const { data: leaderboard, isLoading } = useQuery<leaderboardStandings[]>({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
  });

  async function getLeaderboard() {
    const token = await getToken();

    const res = await axios.get(
      `http://localhost:3000/api/leaderboard/weekly`,
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

  return (
    <RightSideCard title='Weekly Leaderboard' viewMore='/leaderboard'>
      <ScrollArea className='h-[300px] overflow-y-auto relative'>
        <Table className='w-full'>
          <TableBody>
            {combinedLeaderboard.map((standing, index) => {
              if (standing.UserId === user?.id) {
                return (
                  <TableRow
                    key={index}
                    className='hover:bg-gray-200 dark:hover:bg-gray-900/20 transition-colors border-slate-600 bg-green-300 dark:bg-slate-700/20'
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
    </RightSideCard>
  );
}
