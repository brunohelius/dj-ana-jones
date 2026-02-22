import Link from 'next/link';

import { BookingForm } from '@/components/BookingForm';
import { ConceptBackground } from '@/components/ConceptBackground';
import { HeroRotatingImage } from '@/components/HeroRotatingImage';
import { getInstagramPosts } from '@/lib/instagram';
import { getSiteContent } from '@/lib/siteContent';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const siteContent = await getSiteContent();
  const instagramPosts = await getInstagramPosts(6);
  const events = [...siteContent.events].sort((a, b) => a.dateIso.localeCompare(b.dateIso));
  const galleryImages = siteContent.galleryImages;
  const heroImages = siteContent.heroImages.map((image) => image.src);
  const { profile, socialLinks, mediaEmbeds, contactInfo } = siteContent;

  return (
    <main className='relative isolate min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--brand-cream)]'>
      <ConceptBackground />

      <header className='sticky top-0 z-40 border-b border-white/10 bg-[color:var(--bg-overlay)] backdrop-blur-xl'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-10'>
          <Link href='/' className='font-display text-2xl uppercase tracking-[0.12em]'>
            Ana Jones
          </Link>
          <nav className='hidden gap-6 text-xs uppercase tracking-[0.12em] text-[var(--muted)] md:flex'>
            <a href='#sobre' className='transition-colors hover:text-[var(--brand-cream)]'>
              Sobre
            </a>
            <a href='#midia' className='transition-colors hover:text-[var(--brand-cream)]'>
              Midia
            </a>
            <a href='#galeria' className='transition-colors hover:text-[var(--brand-cream)]'>
              Galeria
            </a>
            <a href='#eventos' className='transition-colors hover:text-[var(--brand-cream)]'>
              Eventos
            </a>
            <a href='#contratacao' className='transition-colors hover:text-[var(--brand-cream)]'>
              Contratacao
            </a>
          </nav>
          <a href='#eventos' className='btn-primary hidden md:inline-flex'>
            Entrar na Lista
          </a>
        </div>
      </header>

      <section className='relative overflow-hidden px-4 pb-16 pt-12 md:px-10 md:pb-24 md:pt-20'>
        <div className='hero-glow hero-glow-left' />
        <div className='hero-glow hero-glow-right' />

        <div className='mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.3fr_1fr]'>
          <div className='space-y-7 fade-up'>
            <p className='badge'>{profile.heroSubtitle}</p>
            <h1 className='font-display text-[3.2rem] uppercase leading-[0.9] tracking-[0.04em] text-[var(--brand-cream)] sm:text-[4.4rem] lg:text-[6rem]'>
              Ana Jones
            </h1>
            <figure className='max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.45)]'>
              <div className='relative w-full' style={{ aspectRatio: '16 / 10' }}>
                <HeroRotatingImage images={heroImages} alt='Ana Jones' />
              </div>
              <figcaption className='border-t border-white/10 px-3 py-2 text-xs uppercase tracking-[0.12em] text-[var(--muted)]'>
                Foto destaque rotativa da Ana Jones
              </figcaption>
            </figure>
            <p className='max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-lg'>
              {profile.heroBio}
            </p>
            <div className='flex flex-wrap gap-3'>
              <a href='#eventos' className='btn-primary'>
                Ver Agenda
              </a>
              <a href='#contratacao' className='btn-secondary'>
                Contratar Show
              </a>
            </div>
          </div>

          <div className='glass-card fade-up p-6'>
            <p className='text-xs uppercase tracking-[0.12em] text-[var(--muted)]'>Próximos destaques</p>
            <div className='mt-4 space-y-4'>
              {events.slice(0, 2).map((event) => {
                const signupOpen = event.signupOpen !== false;

                return (
                  <article
                    key={event.slug}
                    className='rounded-2xl border border-white/15 bg-white/5 p-4'
                  >
                    <p className='text-xs uppercase tracking-[0.12em] text-[var(--brand-orange)]'>
                      {event.dateLabel}
                    </p>
                    <h2 className='mt-2 text-xl font-semibold text-[var(--brand-cream)]'>
                      {event.title}
                    </h2>
                    <p className='mt-2 text-sm text-[var(--muted)]'>
                      {event.location} • {event.city}
                    </p>
                    {signupOpen ? (
                      <Link
                        href={`/eventos/${event.slug}`}
                        className='mt-4 inline-flex text-sm font-semibold text-[var(--brand-cyan)] hover:opacity-80'
                      >
                        Entrar na lista
                      </Link>
                    ) : (
                      <span className='mt-4 inline-flex text-sm font-semibold text-[var(--muted)]'>
                        Lista encerrada
                      </span>
                    )}
                  </article>
                );
              })}
            </div>
            <div className='mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>
              <a href={socialLinks.instagram} target='_blank' rel='noreferrer'>
                Instagram
              </a>
              <span>•</span>
              <a href={socialLinks.soundcloud} target='_blank' rel='noreferrer'>
                SoundCloud
              </a>
              <span>•</span>
              <a href={socialLinks.spotify} target='_blank' rel='noreferrer'>
                Spotify
              </a>
              <span>•</span>
              <a href={socialLinks.youtube} target='_blank' rel='noreferrer'>
                YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id='sobre' className='section-shell'>
        <div className='mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_1fr]'>
          <div className='glass-card p-6 md:p-8'>
            <p className='section-kicker'>Sobre</p>
            <h2 className='section-title'>{profile.aboutTitle}</h2>
            <p className='mt-4 text-base leading-relaxed text-[var(--muted)]'>
              {profile.aboutParagraph1}
            </p>
            <p className='mt-4 text-base leading-relaxed text-[var(--muted)]'>
              {profile.aboutParagraph2}
            </p>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <article className='glass-card p-5'>
              <p className='text-xs uppercase tracking-[0.12em] text-[var(--muted)]'>Base</p>
              <p className='mt-2 text-xl font-display uppercase'>{profile.base}</p>
            </article>
            <article className='glass-card p-5'>
              <p className='text-xs uppercase tracking-[0.12em] text-[var(--muted)]'>Projeto</p>
              <p className='mt-2 text-xl font-display uppercase'>{profile.projeto}</p>
            </article>
            <article className='glass-card p-5'>
              <p className='text-xs uppercase tracking-[0.12em] text-[var(--muted)]'>Formato</p>
              <p className='mt-2 text-xl font-display uppercase'>{profile.formato}</p>
            </article>
            <article className='glass-card p-5'>
              <p className='text-xs uppercase tracking-[0.12em] text-[var(--muted)]'>Booking</p>
              <p className='mt-2 text-xl font-display uppercase'>{profile.booking}</p>
            </article>
          </div>
        </div>
      </section>

      <section id='midia' className='section-shell'>
        <div className='mx-auto max-w-6xl'>
          <p className='section-kicker'>Midia</p>
          <h2 className='section-title'>SoundCloud, Spotify oficial e YouTube</h2>
          <div className='mt-8 grid gap-5 lg:grid-cols-3'>
            {mediaEmbeds.map((media) => (
              <article key={media.title} className='glass-card p-4'>
                <h3 className='font-display text-2xl uppercase tracking-[0.08em]'>{media.title}</h3>
                <p className='mt-2 text-sm text-[var(--muted)]'>{media.description}</p>
                <div className='mt-4 overflow-hidden rounded-xl border border-white/15'>
                  <iframe
                    src={media.iframe}
                    title={media.title}
                    className='h-56 w-full'
                    loading='lazy'
                    allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                    allowFullScreen
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id='galeria' className='section-shell'>
        <div className='mx-auto max-w-6xl'>
          <p className='section-kicker'>Galeria</p>
          <h2 className='section-title'>Fotos e imagens oficiais</h2>
          <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {galleryImages.map((image, index) => (
              <figure key={`${image.src}-${index}`} className='gallery-tile'>
                <img src={image.src} alt={image.alt} className='h-full w-full object-cover' />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className='section-shell'>
        <div className='mx-auto max-w-6xl'>
          <p className='section-kicker'>Instagram</p>
          <h2 className='section-title'>Integracao com feed @anajonesdj</h2>
          <p className='mt-3 max-w-2xl text-sm text-[var(--muted)]'>
            Conteudo direto do Instagram oficial da Ana Jones, atualizado automaticamente.
            Quando a integracao estiver indisponivel, o site exibe destaques selecionados para
            manter o visual sempre ativo.
          </p>
          <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target='_blank'
                rel='noreferrer'
                className='gallery-tile group'
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
                <span className='pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 text-xs text-white/90'>
                  {post.caption}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id='eventos' className='section-shell'>
        <div className='mx-auto max-w-6xl'>
          <p className='section-kicker'>Eventos</p>
          <h2 className='section-title'>Agenda + link de lista para convidados</h2>
          <div className='mt-8 grid gap-5 md:grid-cols-2'>
            {events.map((event) => {
              const signupOpen = event.signupOpen !== false;

              return (
                <article key={event.slug} className='glass-card overflow-hidden'>
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className='h-44 w-full object-cover'
                  />
                  <div className='p-5'>
                    <p className='text-xs uppercase tracking-[0.12em] text-[var(--brand-orange)]'>
                      {event.dateLabel}
                    </p>
                    <h3 className='mt-2 text-2xl font-display uppercase tracking-[0.06em]'>
                      {event.title}
                    </h3>
                    <p className='mt-2 text-sm text-[var(--muted)]'>
                      {event.location} • {event.city}
                    </p>
                    <p className='mt-4 text-sm text-[var(--muted)]'>{event.description}</p>
                    {signupOpen ? (
                      <Link href={`/eventos/${event.slug}`} className='btn-primary mt-5 inline-flex'>
                        Abrir Lista do Evento
                      </Link>
                    ) : (
                      <span className='btn-secondary mt-5 inline-flex cursor-not-allowed opacity-70'>
                        Lista encerrada
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id='contratacao' className='section-shell pb-20'>
        <div className='mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.05fr]'>
          <div className='space-y-5'>
            <p className='section-kicker'>Contratacao</p>
            <h2 className='section-title'>Book a DJ set para o seu evento</h2>
            <p className='text-base leading-relaxed text-[var(--muted)]'>
              {contactInfo.bookingDescription}
            </p>

            <div className='grid gap-4 sm:grid-cols-2'>
              <article className='glass-card p-5'>
                <p className='text-xs uppercase tracking-[0.12em] text-[var(--muted)]'>Email</p>
                <a
                  className='mt-2 block text-sm font-semibold text-[var(--brand-cyan)] hover:opacity-80'
                  href={`mailto:${contactInfo.email}`}
                >
                  {contactInfo.email}
                </a>
              </article>
              <article className='glass-card p-5'>
                <p className='text-xs uppercase tracking-[0.12em] text-[var(--muted)]'>WhatsApp</p>
                <a
                  className='mt-2 block text-sm font-semibold text-[var(--brand-cyan)] hover:opacity-80'
                  href={contactInfo.whatsapp}
                  target='_blank'
                  rel='noreferrer'
                >
                  {contactInfo.whatsappLabel}
                </a>
              </article>
            </div>
          </div>

          <BookingForm />
        </div>
      </section>

      <footer className='border-t border-white/10 px-4 py-8 text-xs uppercase tracking-[0.12em] text-[var(--muted)] md:px-10'>
        <div className='mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <p>Ana Jones • {profile.base} • {profile.projeto}</p>
          <div className='flex gap-4'>
            <a href='/admin' className='hover:text-[var(--brand-cream)]'>
              Admin
            </a>
            <a href={socialLinks.instagram} target='_blank' rel='noreferrer' className='hover:text-[var(--brand-cream)]'>
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
