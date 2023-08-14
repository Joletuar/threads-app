import { type FC } from 'react';

import { Inter } from 'next/font/google';

import { ClerkProvider } from '@clerk/nextjs';

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
        <body className={`${inter.className} bg-dark-1 `}>{children}</body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
