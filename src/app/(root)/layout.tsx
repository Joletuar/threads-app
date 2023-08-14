import { type FC } from 'react';

import { Inter } from 'next/font/google';

import { ClerkProvider } from '@clerk/nextjs';

import { Topbar } from '@/components/shared/Topbar';
import { LeftSidebar } from '@/components/shared/LeftSidebar';
import { RightSidebar } from '@/components/shared/RightSidebar';
import { Bottombar } from '@/components/shared/Bottombar';

import '../globals.css';

// definimos los meta tags para el seo
export const metadata = {
  title: 'Threads',
  description: 'A Next.js 13 Meta Threads Application',
};

interface Props {
  children: React.ReactNode;
}

const inter = Inter({ subsets: ['latin'] }); // definimos la fuente que queremos usar

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <ClerkProvider>
      <html lang='es'>
        <head>
          <link rel='icon' href='/favicon.ico' sizes='any' />
        </head>
        {/* llamamos la clase de la fuente en nuestro body */}
        <body className={`${inter.className}`}>
          <Topbar />

          <main className='flex'>
            <LeftSidebar />

            <section className='main-container'>
              <div className='w-full max-w-4xl'>{children}</div>
            </section>

            <RightSidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
