import { redirect } from 'next/navigation';

import { currentUser } from '@clerk/nextjs';

import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { UserCard } from '@/components/cards/UserCard';

const SearchPage = async () => {
  // usuario que esta logeado con clerk
  const user = await currentUser();

  if (!user) return null;

  // información del perfil del usuario que estamos visitando
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect('/onboarding');

  // obtener usuarios
  const { users, isNext } = await fetchUsers({
    userId: user.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className='head-text mb-10'>Search</h1>

      {/* Search bar */}

      <div className='mt-14 flex flex-col gap-9'>
        {users.length === 0 ? (
          <p className='no-result'>Usuario no encontrado</p>
        ) : (
          <>
            {users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                imgUrl={user.image}
                personType='User'
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
