import { redirect } from 'next/navigation';

import { currentUser } from '@clerk/nextjs';

import { fetchUser } from '@/lib/actions/user.actions';
import { PostThreads } from '@/components/forms/PostThreads';

const Page = async () => {
  const user = await currentUser();

  // si no tenemos sesión no mostramos nada
  if (!user) return null;

  // recuperamos la información del usuario
  const userData = await fetchUser(user.id);

  // si el usuario todavia no esta registrado en la base de dato lo redirigimos al home
  if (!userData?.onboarded) redirect('/');

  return (
    <>
      <h1 className='head-text'>Create Thread</h1>

      <PostThreads userId={userData.id.toString()} />
    </>
  );
};

export default Page;
