import React from 'react';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

interface IProps {
  User?: UserObject;
}

export default function FollowButton({ User }: IProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const userId = User?.userId;
  const mutation = useMutation({
    mutationFn: User?.isFollowing ? unfollowUser : followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', { userId }] });
    },
  });
  async function followUser() {
    const token = await getToken();
    const res = await axios.post(
      `http://localhost:3000/api/users/${userId}/follow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  }

  async function unfollowUser() {
    const token = await getToken();
    const res = await axios.delete(
      `http://localhost:3000/api/users/${userId}/unfollow`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  }

  return (
    <>
      {User?.isFollowing ? (
        <Button
          onClick={() => mutation.mutate()}
          variant={'destructive'}
          className='absolute  right-4 top-[7.5rem]'
        >
          {' '}
          Unfollow
        </Button>
      ) : (
        <Button
          onClick={() => mutation.mutate()}
          variant={'outline'}
          className='absolute  right-4 top-[7.5rem]'
        >
          {' '}
          Follow{' '}
        </Button>
      )}
    </>
  );
}
