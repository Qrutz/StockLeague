import EditProfileModal from '@/components/EditProfileModal';
import FollowButton from '@/components/ProfileComponents/FollowButton';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { FaCalendar, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import { SlSocialInstagram } from 'react-icons/sl';
import { Link, useParams } from 'react-router-dom';

export default function ProfilePageProfileCard() {
  const { userId } = useParams<{ userId: string }>();
  const { getToken } = useAuth();
  const { user } = useUser();

  const { data: userProfile, isLoading } = useQuery<UserObject>({
    queryKey: ['user', { userId }],
    queryFn: getUserProfile,
  });

  async function getUserProfile() {
    const token = await getToken();
    const res = await axios.get(`http://localhost:3000/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  useEffect(() => {
    document.title = `${userProfile?.first_name} ${userProfile?.last_name} (@${userProfile?.username}) | Aktieligan`;
  }, [userProfile]);

  if (isLoading) return <div>loading...</div>;

  if (!userProfile) return <div>user not found</div>;

  const isCurrentUser = user?.id === userId; // Check if the profile belongs to the current user

  return (
    <>
      <Card className='rounded-none '>
        <CardContent className='flex flex-col p-0'>
          {/* Banner with relative positioning */}
          <div className='flex bg-slate-800 relative h-[6.5rem]'>
            {/* Container for Avatar and Follow Button */}
            <div className='flex justify-between items-center w-full px-4'>
              {/* Profile Image */}
              <div className=''>
                <Avatar className='h-24 w-24 absolute top-[4rem] left-4 border-2 dark:border-slate-950'>
                  <AvatarImage src={userProfile?.image_url} />
                </Avatar>
              </div>
              {/* Follow Button */}
              {/* <Button
      variant={'outline'}
      className='absolute  right-4 top-[7.5rem]'
    >
      Follow
    </Button> */}
              {isCurrentUser ? (
                <EditProfileModal userData={userProfile} />
              ) : (
                <FollowButton User={userProfile} />
              )}
            </div>
          </div>

          {/* Other Content */}
          <div className='px-4 mt-16'>
            <div className='flex flex-col gap-1'>
              <div className='font-bold text-xl'>
                {userProfile?.first_name} {userProfile?.last_name}
              </div>
              <div className='text-gray-400 text-sm'>
                {userProfile?.username ? '@' + userProfile?.username : null}
              </div>
            </div>

            {/* User Description */}
            <div className='text-sm mt-4'>
              {/* Frozen in Ice, Now day/swing trading mostly in bio sector & large
              CAPS. DD/TA, King of the bottom plays. All my posts are my
              personal opinion, not financial advice. I use SWEEPCAST for
              insight into whales/large money flow orders/Market makers bet */}
              {userProfile?.bio}
            </div>
            <Separator className='mt-4' />

            {/* Social Icons */}

            <div className='flex gap-2 py-4'>
              <span className='text-sm'>
                {' '}
                <span className='font-bold'>
                  {userProfile.following?.length}
                </span>{' '}
                Following{' '}
              </span>

              <span className='text-sm'>
                {' '}
                <span className='font-bold'>
                  {userProfile.followers?.length}
                </span>{' '}
                Followers{' '}
              </span>
            </div>
            <Separator className='mb-4' />

            <div className='flex pb-4 justify-between'>
              <span className='flex  items-center'>
                <Link to={`${userProfile.twitter_url}`}>
                  <FaXTwitter className='dark:text-slate-300 text-xl ' />
                </Link>
                <Separator className='bg-gradient-to-r from-slate-950 via-slate-200 to-slate-950 rotate-90 w-6 ' />
                <FaFacebookF className='text-xl dark:bg-slate-950  cursor-pointer' />
                <Separator className='bg-gradient-to-r from-slate-950 via-slate-200 to-slate-950 rotate-90 w-6 ' />
                <SlSocialInstagram className='text-xl dark:bg-slate-950  cursor-pointer' />
              </span>

              <div className='flex text-xs items-center gap-1 dark:text-slate-500'>
                <FaCalendar className='  ' />
                <span className='  '>
                  {' '}
                  Joined{' '}
                  {new Date(Number(userProfile.createdAt)).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
