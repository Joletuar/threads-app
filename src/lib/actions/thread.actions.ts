'user server';

import { connectToDB } from '../mongoose';
import ThreadModel from '../models/thread.models';
import UserModel from '../models/user.model';
import { revalidatePath } from 'next/cache';

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
    const newThread = await ThreadModel.create({
      text,
      author,
      community: communityId,
    });

    // actualizamos la lista de id de threads y añadimos el nuevo thread creado
    await UserModel.findByIdAndUpdate(author, {
      $push: { threads: newThread._id },
    });

    // revalidamos el path
    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to create new thread: ${error?.message}`);
  }
}

export async function fetchPost(pageNumber = 1, pageSize = 20) {
  await connectToDB();

  // calculamos el offset o número de registros que debemos de saltarnos
  const offset = (pageNumber - 1) * pageSize;

  try {
    // obtener todos los threads que no tienen padres, es decir, los threads principales
    const postsQuery = ThreadModel.find({
      parentId: { $in: [null, undefined] },
    }); // el método find devuelve un query, si se usa el await es lo mismo que usar el .exec

    // número total de posts
    const totalPostCount = await postsQuery.countDocuments();

    // resultado final aplicando todos los querys
    const posts = await postsQuery
      .sort({ createdAt: 'desc' }) // ordenamos de manera descendente por fecha de creación
      .skip(offset) // numero de registros a saltarnos
      .limit(pageSize) // número máximo de registros obtener
      .populate({ path: 'author', model: 'UserModel' }) // obtenemos los datos del usuario a partir de la referencia
      .populate({
        path: 'children',
        model: 'ThreadModel',
        populate: {
          path: 'author',
          model: 'UserModel',
          select: ['_id', 'parentId', 'image'],
        },
      });

    // determinamos si tenemos o no siguiente página
    const isNext = totalPostCount > offset + posts.length;

    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`Failed to get posts: ${error?.message}`);
  }
}
