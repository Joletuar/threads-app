'use client';

import { type ChangeEvent, type FC, useState } from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { UserValidation } from '@/lib/validations/user';
import * as z from 'zod';
import { Textarea } from '../ui/textarea';

interface Props {
  user: {
    id: string | undefined;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

export const AccountProfile: FC<Props> = ({ user, btnTitle }) => {
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm({
    resolver: zodResolver(UserValidation), // propiedad que nos permite agregar un validador externo
    defaultValues: {
      image: user?.image || '',
      name: user?.name || '',
      username: user?.username || '',
      bio: user?.bio || '',
    },
  });

  const onSubmit = (values: z.infer<typeof UserValidation>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    // Crear una nueva instancia para leer archivos
    const fileReader = new FileReader();

    // Verificar si se seleccionaron archivos
    if (e.target.files && e.target.files.length) {
      // Obtener el primer archivo seleccionado
      const file = e.target.files[0];

      // Verificar si el archivo es una imagen
      if (!file.type.includes('image')) return;

      // Almacenar la lista de archivos seleccionados
      setFiles(Array.from(e.target.files));

      // Definir qué hacer cuando se cargue el archivo
      fileReader.onload = async (event) => {
        // Obtener la URL en formato de datos (Data URL) de la imagen
        const imageDataUrl = event.target?.result?.toString() || '';

        // Llamar a la función fieldChange y pasarle la URL de la imagen
        fieldChange(imageDataUrl);
      };

      // Leer y convertir el archivo a una URL en formato de datos (Data URL)
      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-10 justify-start'
      >
        {/* profile photo */}
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
            </FormItem>
          )}

          // Nombre
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex gap-3 flex-col'>
              <FormLabel className='text-base-semibold text-light-2'>
                Nombre
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* username */}

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex gap-3 flex-col'>
              <FormLabel className='text-base-semibold text-light-2'>
                Usuario
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* bio */}

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='flex gap-3 flex-col'>
              <FormLabel className='text-base-semibold text-light-2'>
                Sobre tí
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Textarea
                  rows={10}
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          Guardar
        </Button>
      </form>
    </Form>
  );
};
