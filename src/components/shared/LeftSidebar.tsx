'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { sidebarLinks } from '@/constants';
import { SignOutButton, SignedIn } from '@clerk/clerk-react';

export const LeftSidebar = () => {
  const router = useRouter(); // solo funciona en componentes de cliente, por lo que se debe de activar el "use client"
  const pathname = usePathname();

  return (
    <section className='custom-scrollbar leftsidebar'>
      <ul className='flex w-full flex-1 flex-col gap-6 px-6'>
        {sidebarLinks.map((link) => {
          // verificamos cual es la ruta actual
          // si la ruta actual coincide con la ruta del link entonces retornamos true
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <li key={link.label}>
              <Link
                href={link.route}
                className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                />
                <p className='text-light-1 max-lg:hidden'>{link.label}</p>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className='mt-10 px-6'>
        {/* componente que solo aparece si estamos logeados */}
        {/* todo dentro de este componente se renderizará si existe una sesión */}
        <SignedIn>
          {/* el callback nos permite indicar a donde queremos redirigir cuando cerramos sesión */}
          <SignOutButton signOutCallback={() => router.push('/')}>
            <div className='flex cursor-pointer gap-4 p-4'>
              <Image
                src='/assets/logout.svg'
                alt='logout'
                width={24}
                height={24}
              />
              <p className='text-light-2 max-lg:hidden'>Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};
