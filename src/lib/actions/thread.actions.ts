'use server';

import { revalidatePath } from 'next/cache';

import { connectToDB } from '../mongoose';

import Thread from '../models/thread.models';
import User from '../models/user.model';

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  pathname: string;
}

export async function createThread({
  author,
  communityId,
  pathname,
  text,
}: Params) {
  await connectToDB();

  try {
    // creamos un nuevo thread
    const newThread = await Thread.create({
      text,
      author,
      community: communityId,
    });

    // actualizamos la lista de id de threads y añadimos el nuevo thread creado
    await User.findByIdAndUpdate(author, {
      $push: { threads: newThread._id },
    });

    // revalidamos el path
    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to create new thread: ${error?.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  await connectToDB();

  // calculamos el offset o número de registros que debemos de saltarnos
  const offset = (pageNumber - 1) * pageSize;

  try {
    // obtener todos los threads que no tienen padres, es decir, los threads principales
    const postsQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    }); // el método find devuelve un query, si se usa el await es lo mismo que usar el .exec

    // resultado final aplicando todos los querys
    const posts = await postsQuery
      .sort({ createdAt: 'desc' }) // ordenamos de manera descendente por fecha de creación
      .skip(offset) // numero de registros a saltarnos
      .limit(pageSize) // número máximo de registros obtener
      .populate({ path: 'author', model: 'User' }) // obtenemos los datos del usuario a partir de la referencia
      .populate({
        path: 'children',
        model: 'Thread',
        populate: {
          path: 'author',
          model: 'User',
          select: ['_id', 'parentId', 'image'],
        },
      });

    // número total de posts
    const totalPostCount = await Thread.find({
      parentId: { $in: [null, undefined] },
    }).countDocuments();

    // determinamos si tenemos o no siguiente página
    const isNext = totalPostCount > offset + posts.length;

    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`Failed to get posts: ${error?.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  await connectToDB();

  try {
    // TODO: populate community
    const theadInfo = await Thread.findById(threadId)
      .populate({
        path: 'author',
        model: User,
        select: ['_id', 'id', 'name', 'image'],
      })
      .populate({
        path: 'children',
        model: Thread,
        populate: [
          {
            path: 'author',
            model: User,
            select: ['_id', 'id', 'name', 'image', 'parentId'],
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: ['_id', 'id', 'name', 'image', 'parentId'],
            },
          },
        ],
      });

    return theadInfo;
  } catch (error: any) {
    throw new Error(`Failed to get thread information: ${error?.message}`);
  }
}
