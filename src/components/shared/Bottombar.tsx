'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { sidebarLinks } from '@/constants';

export const Bottombar = () => {
  const pathname = usePathname(); // solo funciona en componentes de cliente, por lo que se debe de activar el "use client"

  return (
    <section className='bottombar'>
      <ul className='bottombar_container'>
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
                className={`bottombar_link ${isActive && 'bg-primary-500'}`}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                />
                <p className='text-subtle-medium text-light-1 max-sm:hidden'>
                  {link.label.split(/\s+./)[0]}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
