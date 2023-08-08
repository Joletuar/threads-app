import { type FC } from 'react';

import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

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

const LayoutAuth: FC<Props> = ({ children }) => {
  return (
    <ClerkProvider>
      <html lang='es'>
        <body className={`${inter.className} bg-dark-1`}>{children}</body>
      </html>
    </ClerkProvider>
  );
};

export default LayoutAuth;
