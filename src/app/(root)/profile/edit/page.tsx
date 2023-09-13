import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { fetchUser } from '@/lib/actions/user.actions';
import { AccountProfile } from '@/components/forms/AccountProfile';

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const userData = {
    id: user.id,
    objectId: userInfo?.id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? '',
    bio: userInfo ? userInfo?.bio : '',
    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <>
      <h1 className='head-text'>Editar Perfil</h1>
      <p className='mt-3 text-base-regular text-light-2'>Realiza tus cambios</p>

      <section className='mt-12'>
        <AccountProfile user={userData} btnTitle='Continuar' />
      </section>
    </>
  );
}

export default Page;