import type { Metadata } from 'next';
import { Bebas_Neue, Space_Grotesk } from 'next/font/google';

import './globals.css';

const normalizeSiteUrl = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'https://anajonesdj.com';
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const siteUrl = normalizeSiteUrl(process.env.SITE_DOMAIN || 'https://anajonesdj.com');

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
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
    siteName: 'Ana Jones',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/gallery/real/ana-profile-djanemag.jpeg',
        width: 1200,
        height: 630,
        alt: 'Ana Jones',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ana Jones',
    description:
      'Site oficial da Ana Jones, fundadora da Clubinho Room em Brasilia. Agenda, galeria, midia, contratacao e lista de eventos.',
    images: ['/gallery/real/ana-profile-djanemag.jpeg'],
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
