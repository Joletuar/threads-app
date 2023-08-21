'use server';

import { revalidatePath } from 'next/cache';

import UserModel from '@/lib/models/user.model';

import { connectToDB } from '../mongoose';

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  pathname: string;
}

export async function updateUser({
  userId,
  name,
  username,
  bio,
  image,
  pathname,
}: Params): Promise<void> {
  await connectToDB();

  try {
    await UserModel.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true, // con este parámetro podemos actualizar un registro si existe, caso contrario inserta uno nuevo
      }
    );

    if (pathname === '/profile/edit') {
      revalidatePath(pathname); // con esto invalidamos el caché de la ruta, y forzamos a que se actualice la información del ruta la próxima vez que se visita
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error?.message}`);
  }
}

export async function fetchUser(userId: string) {
  await connectToDB();

  try {
    const user = await UserModel.findById(userId).lean();
    // .populate({
    //   path: "communitty",
    //   model: Community
    // })
    
    return user
      ? {
          id: user._id,
          name: user.name,
          username: user.username,
          bio: user.bio,
          threads: user.threads,
          onboarded: user.onboarded,
          image: user.image,
          communities: user.communities,
        }
      : null;
  } catch (error: any) {
    throw new Error(`Failed to get user: ${error?.message}`);
  }
}
