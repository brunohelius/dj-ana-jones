export type SiteImage = {
  src: string;
  alt: string;
};

export type SiteProfile = {
  heroSubtitle: string;
  heroBio: string;
  aboutTitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  base: string;
  projeto: string;
  formato: string;
  booking: string;
};

export type SiteSocialLinks = {
  instagram: string;
  soundcloud: string;
  spotify: string;
  youtube: string;
};

export type SiteMediaEmbed = {
  title: string;
  description: string;
  iframe: string;
};

export type SiteContactInfo = {
  email: string;
  whatsapp: string;
  whatsappLabel: string;
  bookingDescription: string;
};

export const DEFAULT_PROFILE: SiteProfile = {
  heroSubtitle: 'Brasilia • Fundadora Clubinho Room',
  heroBio:
    'Sonoridade eletrônica com identidade autoral, sets energéticos e curadoria de pista. Ana Jones atua em Brasilia e lidera a cena da Clubinho Room com experiencias que conectam música, performance e comunidade.',
  aboutTitle: 'Identidade artística',
  aboutParagraph1:
    'Ana Jones nasceu na cena eletrônica de Brasilia e tornou-se referência na construção de atmosferas progressivas e house com personalidade. Como fundadora da Clubinho Room, ela assina eventos que priorizam experiência sonora, comunidade e estética.',
  aboutParagraph2:
    'O projeto combina sets de alta energia, curadoria musical consistente e direção criativa para marcas, clubs e festivais.',
  base: 'Brasilia - DF',
  projeto: 'Clubinho Room',
  formato: 'DJ Set / Live',
  booking: 'Brasil e Exterior',
};

export const DEFAULT_SOCIAL_LINKS: SiteSocialLinks = {
  instagram: 'https://instagram.com/anajonesdj',
  soundcloud: 'https://soundcloud.com',
  spotify: 'https://open.spotify.com/artist/2GuuKuQBZ3AD3opyrL9l8s',
  youtube: 'https://youtube.com',
};

export const DEFAULT_MEDIA_EMBEDS: SiteMediaEmbed[] = [
  {
    title: 'SoundCloud',
    description: 'Sets completos e mixtapes da Ana Jones.',
    iframe:
      'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1969383299&color=%23ff6b35&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false',
  },
  {
    title: 'Spotify Oficial',
    description: 'Perfil oficial da Ana Jones no Spotify.',
    iframe:
      'https://open.spotify.com/embed/artist/2GuuKuQBZ3AD3opyrL9l8s?utm_source=generator',
  },
  {
    title: 'Spotify Autorais',
    description: 'Playlist oficial com faixas autorais da Ana Jones.',
    iframe:
      'https://open.spotify.com/embed/playlist/2o4zp84d5ZGI2Hi6S1Ern5?utm_source=generator',
  },
  {
    title: 'Spotify Sonzeira',
    description: 'Curadoria oficial: So pra quem curte sonzeira.',
    iframe:
      'https://open.spotify.com/embed/playlist/5MbO1bL0hz2FkRu0raWWrk?utm_source=generator',
  },
  {
    title: 'YouTube',
    description: 'Shows, lives e registros visuais da pista.',
    iframe: 'https://www.youtube.com/embed/FlspfN8iHJ0',
  },
];

export const DEFAULT_CONTACT_INFO: SiteContactInfo = {
  email: 'abreuanacrist@gmail.com',
  whatsapp: 'https://wa.me/5561999999999',
  whatsappLabel: '+55 61 99999-9999',
  bookingDescription:
    'Envie os dados do seu projeto e receba proposta com formato técnico, fee e rider. O formulário já salva no painel admin e pode disparar notificação por email via Resend.',
};

export const DEFAULT_HERO_IMAGES: SiteImage[] = [
  {
    src: '/gallery/real/ana-profile-djanemag.jpeg',
    alt: 'Ana Jones em destaque editorial',
  },
  {
    src: '/gallery/real/ana-zamna-festival.jpeg',
    alt: 'Ana Jones em apresentacao no Zamna Festival',
  },
  {
    src: '/gallery/real/ana-dreams-release.jpg',
    alt: 'Capa de lancamento do EP Dreams',
  },
  {
    src: '/gallery/real/ana-avatar-soundcloud.jpg',
    alt: 'Foto oficial de artista no SoundCloud',
  },
  {
    src: '/gallery/real/ana-sente-cover.jpg',
    alt: 'Capa digital do single Sente',
  },
  {
    src: '/gallery/real/ana-clubinho-goiania-artwork.png',
    alt: 'Arte do set Clubinho Room Ed. Goiania',
  },
  {
    src: '/gallery/real/artworks-MyVfYpeTrDzKDT2m-G36AhA-large.jpg',
    alt: 'Techno Connection Radio com Ana Jones',
  },
  {
    src: '/gallery/real/artworks-QAlcAWzmLyqFfcWx-MWgViQ-large.png',
    alt: 'Capa ampliada de Sente e Febre',
  },
];

export const DEFAULT_GALLERY_IMAGES: SiteImage[] = [
  {
    src: '/gallery/real/ana-profile-djanemag.jpeg',
    alt: 'Ana Jones em destaque editorial',
  },
  {
    src: '/gallery/real/ana-zamna-festival.jpeg',
    alt: 'Ana Jones em apresentacao no Zamna Festival',
  },
  {
    src: '/gallery/real/ana-dreams-release.jpg',
    alt: 'Capa de lancamento do EP Dreams',
  },
  {
    src: '/gallery/real/ana-clubinho-goiania-artwork.png',
    alt: 'Arte do set Clubinho Room Ed. Goiania',
  },
  {
    src: '/gallery/real/artworks-MyVfYpeTrDzKDT2m-G36AhA-large.jpg',
    alt: 'Techno Connection Radio com Ana Jones',
  },
  {
    src: '/gallery/real/artworks-QAlcAWzmLyqFfcWx-MWgViQ-large.png',
    alt: 'Capa ampliada de Sente e Febre',
  },
  {
    src: '/gallery/real/ana-avatar-soundcloud.jpg',
    alt: 'Foto oficial de artista no SoundCloud',
  },
  {
    src: '/gallery/real/ana-sente-cover.jpg',
    alt: 'Capa digital do single Sente',
  },
  {
    src: '/gallery/real/ana-soundcloud-visual.jpg',
    alt: 'Visual oficial de artista',
  },
  {
    src: '/gallery/real/artworks-MyVfYpeTrDzKDT2m-G36AhA-t1080x1080.jpg',
    alt: 'Techno Connection Radio #025',
  },
  {
    src: '/gallery/real/artworks-QAlcAWzmLyqFfcWx-MWgViQ-t1080x1080.png',
    alt: 'Kaluts, Ana Jones - Sente/Febre (cover)',
  },
];
