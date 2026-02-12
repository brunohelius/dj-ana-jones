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
    title: 'Aniversario Ana Jones x Heineken',
    dateIso: '2026-02-14',
    dateLabel: '14 de fevereiro de 2026',
    timeLabel: '20h ate 05h',
    location: 'Heineken Stage - Clubinho Room',
    city: 'Brasilia - DF',
    description:
      'Noite especial de aniversario da Ana Jones com experiencia Heineken, set extended, convidados da cena local e lista de nomes para o publico.',
    highlights: [
      'Edicao especial de aniversario com assinatura Heineken',
      'Set extended da Ana Jones com convidados da Clubinho Room',
      'Experiencia visual e ativações de marca durante a noite',
    ],
    listRules: [
      'Lista valida ate 23h00 do dia 14/02.',
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
