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
    revalidatePath(pathname)

  } catch (error: any) {
    throw new Error(`Failed to createa new thread: ${error?.message}`);
  }
}
