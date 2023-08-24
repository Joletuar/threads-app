'use client';

import { type FC } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '../ui/textarea';

import { ThreadValidation } from '@/lib/validations/thread';
import { createThread } from '@/lib/actions/thread.actions';

interface Props {
  userId: string;
}

export const PostThreads: FC<Props> = ({ userId }) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(ThreadValidation), // propiedad que nos permite agregar un validador externo
    defaultValues: {
      thread: '',
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    // creamos el nuevo thread
    await createThread({
      text: values.thread,
      author: userId,
      communityId: null,
      pathname,
    });

    // redirigimos al home
    router.push('/');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mt-10 flex flex-col gap-10 justify-start'
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex gap-3 flex-col'>
              <FormLabel className='text-base-semibold text-light-2'>
                Contenido del Thread
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Textarea
                  rows={15}
                  className='no-focus border border-dark-4 bg-dark-3 text-light-1'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          Crear Thread
        </Button>
      </form>
    </Form>
  );
};
