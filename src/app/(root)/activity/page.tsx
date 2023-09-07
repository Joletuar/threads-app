import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { fetchUser, getActivity } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';

const ActivityPage = async () => {
  // usuario que esta logeado con clerk, tiene el id normal
  const user = await currentUser();

  if (!user) return null;

  // información del perfil del usuario que estamos visitando
  // tiene el _id de mongoose
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect('/onboarding');

  // actividad del usuario
  const activity = await getActivity(userInfo.id);

  return (
    <section>
      <h1 className='head-text mb-10'>
        <section className='mt-10 flex flex-col gap-5 '>
          {activity.length > 0 ? (
            activity.map((item) => (
              <Link href={`/thread/${item.parentId}`} key={item.id}>
                <article className='activity-card'>
                  <Image
                    src={item.author.image}
                    width={20}
                    height={20}
                    alt='Profile picture'
                    className='rounded-full object-cover'
                  />
                  <p className='!text-small-regular text-light-1'>
                    <span className='mr-1 text-primary-500'>
                      {item.author.name}
                    </span>
                    respondió tu thread
                  </p>
                </article>
              </Link>
            ))
          ) : (
            <p className='!text-base-regular text-light-3'>
              No existe actividad aun
            </p>
          )}
        </section>
      </h1>
    </section>
  );
};

export default ActivityPage;
