'use server';

import { revalidatePath } from 'next/cache';

import User from '@/lib/models/user.model';

import { connectToDB } from '../mongoose';
import Thread from '../models/thread.models';

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
    await User.findOneAndUpdate(
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
    const user = await User.findOne({ id: userId });
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

export async function fetchUserPosts(userId: string) {
  await connectToDB();

  try {
    // obtenemos todos los threads que tengan el id especificado
    // TODO: populate community
    const postsUser = await User.findById(userId).populate({
      path: 'Thread',
      model: Thread,
      populate: {
        path: 'children',
        model: Thread,
        populate: {
          path: 'author',
          model: 'User',
          select: ['name', 'image', 'id'],
        },
      },
    });

    return postsUser

  } catch (error: any) {
    throw new Error(`Failed to get user posts: ${error?.message}`);
  }
}
