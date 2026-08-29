export type DjEvent = {
  slug: string;
  title: string;
  dateIso: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  city: string;
  description: string;
  highlights: string[];
  listRules: string[];
  coverImage: string;
  signupOpen?: boolean;
  signupClosedMessage?: string;
};

export const EVENTS: DjEvent[] = [
  {
    slug: 'clubinho-room-pocket-edition',
    title: 'Clubinho Room Pocket Edition',
    dateIso: '2026-11-21',
    dateLabel: '21 de novembro de 2026',
    timeLabel: '18h',
    location: 'Condominio RK',
    city: 'Sobradinho - DF',
    description:
      'Edicao pocket da Clubinho Room: formato intimista, pista curada e a energia da cena em escala reduzida. Ana Jones no comando do set principal em um espaco exclusivo do Condominio RK, em Sobradinho.',
    highlights: [
      'Formato pocket: publico limitado e experiencia proxima da pista',
      'Set extended da Ana Jones com house, melodic e progressive',
      'Ambiente exclusivo do Condominio RK em Sobradinho',
    ],
    listRules: [
      'Lista valida ate 22h00 do dia 21/11.',
      'Nome completo e documento obrigatorios na entrada.',
      'Vagas limitadas: confirmacao por ordem de inscricao.',
    ],
    coverImage: '/gallery/real/ana-clubinho-goiania-artwork.png',
    signupOpen: true,
  },
  {
    slug: 'sunset-clubinho-edition',
    title: 'Sunset Clubinho Edition',
    dateIso: '2026-10-10',
    dateLabel: '10 de outubro de 2026',
    timeLabel: '16h ate 23h',
    location: 'Rooftop Setor de Clubes',
    city: 'Brasilia - DF',
    description:
      'Edicao sunset com sonoridade house, melodic e progressive para aquecer a temporada de primavera.',
    highlights: [
      'Set sunset da Ana Jones ao vivo',
      'Experiencia audio premium',
      'Acesso rapido para nomes cadastrados',
    ],
    listRules: [
      'Confirmacao por ordem de inscricao.',
      'Entrada sujeita a lotacao maxima da casa.',
      'Check-in com nome da lista ate 19h30.',
    ],
    coverImage: '/gallery/real/artworks-MyVfYpeTrDzKDT2m-G36AhA-t1080x1080.jpg',
    signupOpen: true,
  },
];

export const getEventBySlug = (slug: string) =>
  EVENTS.find((event) => event.slug === slug);
