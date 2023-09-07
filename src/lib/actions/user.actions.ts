'use server';

import { revalidatePath } from 'next/cache';

import User from '@/lib/models/user.model';
import { FilterQuery, SortOrder } from 'mongoose';

import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';

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
      path: 'threads',
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

    return postsUser;
  } catch (error: any) {
    throw new Error(`Failed to get user posts: ${error?.message}`);
  }
}

export async function fetchUsers({
  userId,
  pageNumber = 1,
  pageSize = 20,
  searchString = '',
  sortBy = 'desc',
}: {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
  searchString?: string;
  sortBy?: SortOrder;
}) {
  await connectToDB();

  const offset = (pageNumber - 1) * pageSize;

  // regrex para buscar en el nombre del usuario sin tener en cuenta minúsculas o mayúsculas
  const regex = new RegExp(searchString, 'i');

  // query para filtrar los usuarios que no sean el usuario actual
  const query: FilterQuery<typeof User> = { id: { $ne: userId } };

  if (searchString.trim() !== '') {
    // si se especifica una cadena de busqueda, se agrega un filtro para buscar en el nombre o username del usuario
    // con el operador $regex, se indica que la busqueda sea case-insensitive (no importa si es mayáscula o mináscula)
    // $regex: /regex/, $options: 'i'

    query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
  }

  // se agrega un sort para ordenar los usuarios por fecha de creación
  const sortOption = { createdAt: sortBy };

  try {
    // obtenemos los usuarios con la query y la opcion de ordenamiento
    const usersQuery = await User.find(query)
      .skip(offset)
      .limit(pageSize)
      .sort(sortOption);

    // obtener el número total de usuarios
    const totalUserCount = await User.countDocuments(query);

    // determinamos si tenemos o no siguiente página
    const isNext = totalUserCount > offset + usersQuery.length;

    return {
      users: usersQuery,
      isNext,
    };
  } catch (error: any) {
    throw new Error(`Failed to get users: ${error?.message}`);
  }
}

export async function getActivity(userId: string) {
  await connectToDB();

  try {
    // obtenemos los threads que tengan el id especificado
    const userThreads = await Thread.find({ author: userId });

    // obtenemos los ids de los threads que tengan children
    const childrenThreadsId = userThreads.flatMap(
      (userThread) => userThread.children
    );

    // obtenemos los threads que no sean del usuario actual
    const replies = await Thread.find({
      _id: { $in: childrenThreadsId },
      author: { $ne: userId },
    }).populate({
      path: 'author',
      model: 'User',
      select: ['name', 'image', '_id'],
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to get activity: ${error?.message}`);
  }
}
