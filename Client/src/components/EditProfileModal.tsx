import React, { useRef, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { FaCameraRetro } from 'react-icons/fa6';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { FaXTwitter } from 'react-icons/fa6';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth, useUser } from '@clerk/clerk-react';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import { Textarea } from './ui/textarea';
import axios from 'axios';

export default function EditProfileModal({ userData }: { userData: unknown }) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(user?.imageUrl);
  const queryClient = useQueryClient();

  const formSchema = z.object({
    username: z.string().min(2, {
      message: 'Username must be at least 2 characters.',
    }),
    bio: z.string().max(160).min(2, {
      message: 'Bio must be at least 2 characters.',
    }),
    profileImage: z.any(),
    twitter_url: z.string().url().max(80, {
      message: 'Twitter url must be at most 80 characters.',
    }),
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      // @ts-expect-error cbaasdfasdf
      username: user?.username,
      bio: userData.bio,
      twitter_url: userData.twitter_url ? userData.twitter_url : '',
    },
  });

  type ProfileFormValues = z.infer<typeof formSchema>;

  async function onSubmit(data: ProfileFormValues) {
    console.log('asdfasf');
    console.log(data);
    // user?.setProfileImage({
    //   file: data.profileImage,
    // });

    if (data.profileImage) {
      await user?.setProfileImage({
        file: data.profileImage,
      });
    }

    if (data.username) {
      await user?.update({
        username: data.username,
      });
    }

    await axios.put(
      `http://localhost:3000/api/users/${user?.id}`,

      {
        bio: data.bio,
        twitter_url: data.twitter_url,
      },
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    queryClient.invalidateQueries(['user', user?.id] as InvalidateQueryFilters);
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newAvatarUrl = URL.createObjectURL(file);
      setAvatarUrl(newAvatarUrl); // Update the avatar URL
      form.setValue('profileImage', file); // Update the form value
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'} className='absolute  right-4 top-[7.5rem]'>
          {' '}
          Edit Profile{' '}
        </Button>
      </DialogTrigger>

      <DialogContent className='text-slate-300 items-center'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='profileImage'
              render={() => (
                <FormItem className='relative inline-block'>
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <div className='relative w-full mt-[-10px]'>
                      {' '}
                      {/* Adjust margin-top as needed */}
                      {/* Container for Avatar and Icon */}
                      <div className='relative inline-block'>
                        {' '}
                        {/* Changed to inline-block and relative */}
                        <Avatar className='h-20 w-20 border-2 dark:border-slate-950'>
                          <AvatarImage src={avatarUrl || user?.imageUrl} />
                          <AvatarFallback></AvatarFallback>
                        </Avatar>
                        <FaCameraRetro
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                          }}
                          className='absolute text-slate-300 font-bold rounded-full hover:shadow-lg hover:bg-slate-800 h-8 w-8 p-1 cursor-pointer'
                          onClick={handleIconClick}
                        />
                        <input
                          ref={fileInputRef}
                          type='file'
                          className='hidden'
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Tell us a little bit about yourself'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='twitter_url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FaXTwitter className='w-6 h-6' />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='x.com' {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogClose asChild>
              <Button variant={'default'} type='submit'>
                Submit
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
