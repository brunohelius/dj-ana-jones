import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ConceptBackground } from '@/components/ConceptBackground';
import { EventSignupForm } from '@/components/EventSignupForm';
import { EVENTS, getEventBySlug } from '@/lib/events';

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return EVENTS.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return {
      title: 'Evento nao encontrado | DJ Ana Jones',
    };
  }

  return {
    title: `${event.title} | DJ Ana Jones`,
    description: `${event.dateLabel} em ${event.city}. Reserve seu nome na lista da DJ Ana Jones.`,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <main className='relative isolate min-h-screen overflow-x-hidden bg-[var(--bg)] px-4 py-10 text-[var(--brand-cream)] md:px-10'>
      <ConceptBackground />

      <div className='mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.05fr]'>
        <section className='glass-card p-6 md:p-8'>
          <Link
            href='/'
            className='inline-flex text-xs uppercase tracking-[0.12em] text-[var(--brand-orange)] transition-opacity hover:opacity-80'
          >
            Voltar para o site
          </Link>

          <h1 className='mt-5 text-4xl font-display uppercase leading-none md:text-6xl'>
            {event.title}
          </h1>

          <p className='mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)]'>
            {event.description}
          </p>

          <div className='mt-6 grid gap-4 md:grid-cols-2'>
            <div className='rounded-2xl border border-white/15 bg-white/5 p-4'>
              <p className='text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Data</p>
              <p className='mt-2 font-semibold text-[var(--brand-cream)]'>{event.dateLabel}</p>
            </div>
            <div className='rounded-2xl border border-white/15 bg-white/5 p-4'>
              <p className='text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Horario</p>
              <p className='mt-2 font-semibold text-[var(--brand-cream)]'>{event.timeLabel}</p>
            </div>
            <div className='rounded-2xl border border-white/15 bg-white/5 p-4'>
              <p className='text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Local</p>
              <p className='mt-2 font-semibold text-[var(--brand-cream)]'>{event.location}</p>
            </div>
            <div className='rounded-2xl border border-white/15 bg-white/5 p-4'>
              <p className='text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Cidade</p>
              <p className='mt-2 font-semibold text-[var(--brand-cream)]'>{event.city}</p>
            </div>
          </div>

          <div className='mt-8'>
            <h2 className='text-lg font-display uppercase tracking-[0.08em]'>Destaques</h2>
            <ul className='mt-3 space-y-2 text-sm text-[var(--muted)]'>
              {event.highlights.map((item) => (
                <li key={item} className='rounded-xl border border-white/10 bg-white/5 px-4 py-3'>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className='mt-8'>
            <h2 className='text-lg font-display uppercase tracking-[0.08em]'>Regras da Lista</h2>
            <ul className='mt-3 space-y-2 text-sm text-[var(--muted)]'>
              {event.listRules.map((rule) => (
                <li key={rule} className='rounded-xl border border-white/10 bg-white/5 px-4 py-3'>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <EventSignupForm eventSlug={event.slug} eventTitle={event.title} />
        </section>
      </div>
    </main>
  );
}
