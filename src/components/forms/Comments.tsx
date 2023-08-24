'use client';

import { type FC } from 'react';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

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
import { Input } from '../ui/input';

import { CommentValidation } from '@/lib/validations/thread';

interface Props {
  threadId: string;
  currentUserImg: string;
  currentId: string;
}

export const Comments: FC<Props> = ({
  currentId,
  threadId,
  currentUserImg,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation), // propiedad que nos permite agregar un validador externo
    defaultValues: {
      thread: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    // creamos el nuevo thread
    //   await createThread({
    //     text: values.thread,
    //     author: userId,
    //     communityId: null,
    //     pathname,
    //   });

    // redirigimos al home
    router.push('/');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='comment-form'>
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex gap-3 flex-col w-full'>
              <FormLabel className='text-base-semibold text-light-2 bg-red-600 h-[48px]'>
                <Image
                  className='rounded-full'
                  src={currentUserImg}
                  alt='User image Profile'
                  width={48}
                  height={48}
                />
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input
                  type='text'
                  {...field}
                  placeholder='¿Qué tienes en mente?'
                  className='no-focus text-light-1 outline-none'
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
