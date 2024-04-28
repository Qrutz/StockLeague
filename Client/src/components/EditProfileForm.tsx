import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Textarea } from '@/components/ui/textarea';

export default function EditProfileForm() {
  const formSchema = z.object({
    username: z.string().min(2, {
      message: 'Username must be at least 2 characters.',
    }),
    bio: z.string().max(160).min(2, {
      message: 'Bio must be at least 2 characters.',
    }),
    banner: z.unknown(),
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      bio: '',
    },
  });

  type ProfileFormValues = z.infer<typeof formSchema>;

  async function onSubmit(data: ProfileFormValues) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          name='bio'
          render={() => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Tell us a little bit about yourself'
                  className='resize-none'
                />{' '}
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
