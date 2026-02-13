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
  title: {
    default: 'Ana Jones',
    template: '%s | Ana Jones',
  },
  description:
    'Site oficial da Ana Jones, fundadora da Clubinho Room em Brasilia. Agenda, galeria, midia, contratacao e lista de eventos.',
  openGraph: {
    title: 'Ana Jones',
    description:
      'Site oficial da Ana Jones, fundadora da Clubinho Room em Brasilia. Agenda, galeria, midia, contratacao e lista de eventos.',
    url: 'https://anajonesdj.com',
    siteName: 'Ana Jones',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Ana Jones',
    description:
      'Site oficial da Ana Jones, fundadora da Clubinho Room em Brasilia. Agenda, galeria, midia, contratacao e lista de eventos.',
  },
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
