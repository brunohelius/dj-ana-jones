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
};

export const EVENTS: DjEvent[] = [
  {
    slug: 'aniversario-ana-jones-2026',
    title: 'Aniversario da Ana Jones',
    dateIso: '2026-08-22',
    dateLabel: '22 de agosto de 2026',
    timeLabel: '22h ate 06h',
    location: 'Clubinho Room',
    city: 'Brasilia - DF',
    description:
      'Noite especial de aniversario com set extended da Ana Jones, convidados da cena local e experiencia visual imersiva.',
    highlights: [
      'Set principal de 3 horas por Ana Jones',
      'Line-up com convidados da Clubinho Room',
      'Aftermovie profissional para redes sociais',
    ],
    listRules: [
      'Lista valida ate 23h59 do dia do evento.',
      'Nome completo e documento obrigatorios na entrada.',
      'Cada inscricao permite ate 2 acompanhantes.',
    ],
    coverImage: '/gallery/real/ana-zamna-festival.jpeg',
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
  },
];

export const getEventBySlug = (slug: string) =>
  EVENTS.find((event) => event.slug === slug);
