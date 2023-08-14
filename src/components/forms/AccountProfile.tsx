'use client';

import type { ChangeEvent, FC } from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { UserValidation } from '@/lib/validations/user';
import * as z from 'zod';

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const defaultValues = { image: '', name: '', username: '', bio: '' };

export const AccountProfile: FC<Props> = ({ user, btnTitle }) => {
  const form = useForm({
    resolver: zodResolver(UserValidation), // propiedad que nos permite agregar un validador externo
    defaultValues,
  });

  const onSubmit = (values: z.infer<typeof UserValidation>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  };

  const handleImage = (
    e: ChangeEvent,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-10 justify-start'
      >
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile photo'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                  <Image
                    src={'assets/profile.svg'}
                    alt='profile photo'
                    width={24}
                    height={24}
                    priority
                    className='object-contain'
                  />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input
                  type='file'
                  placeholder='Subir imagen'
                  accept='image/**'
                  className='account-form_image-input'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
};
