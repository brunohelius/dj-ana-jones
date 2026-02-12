import type { Metadata } from 'next';
import { Bebas_Neue, Space_Grotesk } from 'next/font/google';

import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-body',
  subsets: ['latin'],
});

const bebasNeue = Bebas_Neue({
  variable: '--font-display',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'DJ Ana Jones | Site Oficial',
  description:
    'Site oficial da DJ Ana Jones, fundadora da Clubinho Room em Brasilia. Agenda, galeria, midia, contratacao e lista de eventos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR'>
      <body className={`${spaceGrotesk.variable} ${bebasNeue.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
