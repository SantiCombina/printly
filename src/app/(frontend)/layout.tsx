import { Inter } from 'next/font/google';
import React from 'react';

import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  description: 'El cotizador que tu imprenta necesita.',
  title: 'Printly',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans`}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
