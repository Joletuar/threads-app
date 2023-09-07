'use server';

import { revalidatePath } from 'next/cache';

import { connectToDB } from '../mongoose';

import Thread from '../models/thread.model';
import User from '../models/user.model';
import Community from '../models/community.model';

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
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    // creamos un nuevo thread
    const newThread = await Thread.create({
      text,
      author,
      community: communityIdObject,
    });

    // actualizamos la lista de id de threads y añadimos el nuevo thread creado
    await User.findByIdAndUpdate(author, {
      $push: { threads: newThread._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: newThread._id },
      });
    }

    // revalidamos el path
    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to create new thread: ${error?.message}`);
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  await connectToDB();

  try {
    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate('author community');

    if (!mainThread) {
      throw new Error('Thread not found');
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
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
      })
      .populate({
        path: 'community',
        model: Community,
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

export async function addCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}: {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}) {
  await connectToDB();

  try {
    // obtenemos el thread original
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error(`Failed to get thread`);
    }

    // creamos el nuevo comentario/thread
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    // guardamos el thread
    const savedCommentThread = await commentThread.save();

    // actualizamos el thread original para incluir un nuevo children id
    originalThread.children.push(savedCommentThread._id);

    // guardamos la actualizaciones del thread original
    await originalThread.save();

    // revalidamos el path
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to get thread information: ${error?.message}`);
  }
}
