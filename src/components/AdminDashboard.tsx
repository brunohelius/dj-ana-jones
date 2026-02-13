'use client';

import { useMemo, useState } from 'react';

type EventSignup = {
  id: string;
  eventSlug: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  guestCount: number;
  notes?: string;
  createdAt: string;
};

type BookingRequest = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  eventType: string;
  eventDate?: string;
  city?: string;
  message?: string;
  createdAt: string;
};

type SiteImage = {
  src: string;
  alt: string;
};

type SiteEvent = {
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

type SiteContent = {
  heroImages: SiteImage[];
  galleryImages: SiteImage[];
  events: SiteEvent[];
  updatedAt: string;
};

type LoadState = {
  kind: 'idle' | 'loading' | 'loaded' | 'error';
  message?: string;
};

export const AdminDashboard = () => {
  const [accessKey, setAccessKey] = useState('');
  const [eventSlug, setEventSlug] = useState('');
  const [signups, setSignups] = useState<EventSignup[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [state, setState] = useState<LoadState>({ kind: 'idle' });
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [siteContentState, setSiteContentState] = useState<LoadState>({ kind: 'idle' });

  const totalGuests = useMemo(() => {
    return signups.reduce((acc, item) => acc + 1 + item.guestCount, 0);
  }, [signups]);

  const loadData = async () => {
    setState({ kind: 'loading' });

    try {
      const [signupsResponse, bookingsResponse] = await Promise.all([
        fetch(`/api/event-signups${eventSlug ? `?eventSlug=${encodeURIComponent(eventSlug)}` : ''}`, {
          headers: { 'x-admin-key': accessKey },
          cache: 'no-store',
        }),
        fetch('/api/booking-requests', {
          headers: { 'x-admin-key': accessKey },
          cache: 'no-store',
        }),
      ]);

      if (!signupsResponse.ok || !bookingsResponse.ok) {
        setState({
          kind: 'error',
          message: 'Chave invalida ou sem permissao para acessar o painel.',
        });
        return;
      }

      const [signupsBody, bookingsBody] = (await Promise.all([
        signupsResponse.json(),
        bookingsResponse.json(),
      ])) as [{ data: EventSignup[] }, { data: BookingRequest[] }];

      setSignups(signupsBody.data || []);
      setBookings(bookingsBody.data || []);
      setState({ kind: 'loaded' });
    } catch {
      setState({
        kind: 'error',
        message: 'Falha ao consultar o backend. Tente novamente.',
      });
    }
  };

  const loadSiteContent = async () => {
    setSiteContentState({ kind: 'loading' });

    try {
      const response = await fetch('/api/site-content', {
        headers: { 'x-admin-key': accessKey },
        cache: 'no-store',
      });

      if (!response.ok) {
        setSiteContentState({
          kind: 'error',
          message: 'Chave invalida ou sem permissao para editar o conteudo.',
        });
        return;
      }

      const body = (await response.json()) as { data: SiteContent };
      setSiteContent(body.data);
      setSiteContentState({ kind: 'loaded' });
    } catch {
      setSiteContentState({
        kind: 'error',
        message: 'Falha ao consultar o conteudo. Tente novamente.',
      });
    }
  };

  const saveSiteContent = async () => {
    if (!siteContent) {
      return;
    }

    setSiteContentState({ kind: 'loading' });

    try {
      const response = await fetch('/api/site-content', {
        method: 'PUT',
        headers: {
          'x-admin-key': accessKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteContent),
      });

      if (!response.ok) {
        setSiteContentState({
          kind: 'error',
          message: 'Nao foi possivel salvar. Verifique a chave e tente novamente.',
        });
        return;
      }

      const body = (await response.json()) as { data: SiteContent };
      setSiteContent(body.data);
      setSiteContentState({ kind: 'loaded' });
    } catch {
      setSiteContentState({
        kind: 'error',
        message: 'Falha ao salvar o conteudo. Tente novamente.',
      });
    }
  };

  const updateHeroImage = (index: number, patch: Partial<SiteImage>) => {
    setSiteContent((previous) => {
      if (!previous) {
        return previous;
      }

      const next = [...previous.heroImages];
      next[index] = { ...next[index], ...patch };

      return { ...previous, heroImages: next };
    });
  };

  const moveHeroImage = (from: number, to: number) => {
    setSiteContent((previous) => {
      if (!previous) {
        return previous;
      }

      if (to < 0 || to >= previous.heroImages.length || from === to) {
        return previous;
      }

      const next = [...previous.heroImages];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);

      return { ...previous, heroImages: next };
    });
  };

  const removeHeroImage = (index: number) => {
    setSiteContent((previous) => {
      if (!previous) {
        return previous;
      }

      const next = previous.heroImages.filter((_, idx) => idx !== index);
      return { ...previous, heroImages: next };
    });
  };

  const addHeroImage = () => {
    setSiteContent((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        heroImages: [...previous.heroImages, { src: '', alt: 'Ana Jones' }],
      };
    });
  };

  const updateGalleryImage = (index: number, patch: Partial<SiteImage>) => {
    setSiteContent((previous) => {
      if (!previous) {
        return previous;
      }

      const next = [...previous.galleryImages];
      next[index] = { ...next[index], ...patch };

      return { ...previous, galleryImages: next };
    });
  };

  const moveGalleryImage = (from: number, to: number) => {
    setSiteContent((previous) => {
      if (!previous) {
        return previous;
      }

      if (to < 0 || to >= previous.galleryImages.length || from === to) {
        return previous;
      }

      const next = [...previous.galleryImages];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);

      return { ...previous, galleryImages: next };
    });
  };

  const removeGalleryImage = (index: number) => {
    setSiteContent((previous) => {
      if (!previous) {
        return previous;
      }

      const next = previous.galleryImages.filter((_, idx) => idx !== index);
      return { ...previous, galleryImages: next };
    });
  };

  const addGalleryImage = () => {
    setSiteContent((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        galleryImages: [...previous.galleryImages, { src: '', alt: 'Ana Jones' }],
      };
    });
  };

  const updateEvent = (index: number, patch: Partial<SiteEvent>) => {
    setSiteContent((previous) => {
      if (!previous) {
        return previous;
      }

      const next = [...previous.events];
      next[index] = { ...next[index], ...patch };

      return { ...previous, events: next };
    });
  };

  const removeEvent = (index: number) => {
    setSiteContent((previous) => {
      if (!previous) {
        return previous;
      }

      const next = previous.events.filter((_, idx) => idx !== index);
      return { ...previous, events: next };
    });
  };

  const addEvent = () => {
    setSiteContent((previous) => {
      if (!previous) {
        return previous;
      }

      const seedCover =
        previous.heroImages.find((item) => item.src.trim().length > 0)?.src ||
        previous.galleryImages.find((item) => item.src.trim().length > 0)?.src ||
        '/gallery/real/ana-profile-djanemag.jpeg';

      const nextEvent: SiteEvent = {
        slug: '',
        title: '',
        dateIso: '',
        dateLabel: '',
        timeLabel: '',
        location: '',
        city: '',
        description: '',
        highlights: [],
        listRules: [],
        coverImage: seedCover,
        signupOpen: true,
        signupClosedMessage: '',
      };

      return {
        ...previous,
        events: [...previous.events, nextEvent],
      };
    });
  };

  return (
    <main className='min-h-screen bg-[var(--bg)] px-4 py-10 text-[var(--brand-cream)] md:px-10'>
      <div className='mx-auto max-w-6xl space-y-6'>
        <header className='glass-card p-6'>
          <h1 className='text-3xl font-display uppercase tracking-[0.08em]'>
            Painel Admin - Ana Jones
          </h1>
          <p className='mt-2 text-sm text-[var(--muted)]'>
            Consulte interessados da lista de eventos e pedidos de contratacao.
          </p>
          <div className='mt-5 flex flex-col gap-3 md:flex-row'>
            <input
              type='password'
              className='field md:max-w-sm'
              value={accessKey}
              onChange={(event) => setAccessKey(event.target.value)}
              placeholder='Informe ADMIN_DASHBOARD_KEY'
            />
            <button className='btn-primary md:w-auto' onClick={loadData} type='button'>
              {state.kind === 'loading' ? 'Carregando...' : 'Carregar Dados'}
            </button>
          </div>
          {state.kind === 'error' && (
            <p className='mt-3 text-sm text-rose-300'>{state.message}</p>
          )}
        </header>

        <section className='grid gap-4 md:grid-cols-3'>
          <article className='glass-card p-5'>
            <p className='text-xs uppercase tracking-[0.12em] text-[var(--muted)]'>Inscricoes</p>
            <p className='mt-2 text-3xl font-display'>{signups.length}</p>
          </article>
          <article className='glass-card p-5'>
            <p className='text-xs uppercase tracking-[0.12em] text-[var(--muted)]'>Publico Estimado</p>
            <p className='mt-2 text-3xl font-display'>{totalGuests}</p>
          </article>
          <article className='glass-card p-5'>
            <p className='text-xs uppercase tracking-[0.12em] text-[var(--muted)]'>Pedidos de Show</p>
            <p className='mt-2 text-3xl font-display'>{bookings.length}</p>
          </article>
        </section>

        <section className='glass-card overflow-x-auto p-5'>
          <h2 className='text-xl font-display uppercase tracking-[0.08em]'>Lista de Eventos</h2>
          <div className='mt-4 flex flex-wrap gap-3'>
            <input
              className='field w-full md:max-w-xs'
              value={eventSlug}
              onChange={(event) => setEventSlug(event.target.value)}
              placeholder='Filtrar por slug do evento (ex: aniversario-ana-jones-2026)'
            />
            <button
              type='button'
              className='btn-secondary'
              disabled={state.kind !== 'loaded'}
              onClick={() => {
                if (state.kind !== 'loaded' || !accessKey) {
                  return;
                }

                const url = `/api/event-signups?adminKey=${encodeURIComponent(
                  accessKey,
                )}&format=csv${eventSlug ? `&eventSlug=${encodeURIComponent(eventSlug)}` : ''}`;
                window.location.assign(url);
              }}
            >
              Exportar CSV
            </button>
          </div>
          <table className='mt-4 min-w-full text-left text-sm'>
            <thead className='text-xs uppercase tracking-[0.08em] text-[var(--muted)]'>
              <tr>
                <th className='pb-2 pr-4'>Data</th>
                <th className='pb-2 pr-4'>Evento</th>
                <th className='pb-2 pr-4'>Nome</th>
                <th className='pb-2 pr-4'>Contato</th>
                <th className='pb-2 pr-4'>Cidade</th>
                <th className='pb-2 pr-4'>Acomp.</th>
              </tr>
            </thead>
            <tbody>
              {signups.map((signup) => (
                <tr key={signup.id} className='border-t border-white/10'>
                  <td className='py-3 pr-4'>
                    {new Date(signup.createdAt).toLocaleString('pt-BR')}
                  </td>
                  <td className='py-3 pr-4'>{signup.eventSlug}</td>
                  <td className='py-3 pr-4'>{signup.name}</td>
                  <td className='py-3 pr-4'>
                    {signup.email || '-'}
                    {signup.phone ? ` / ${signup.phone}` : ''}
                  </td>
                  <td className='py-3 pr-4'>{signup.city || '-'}</td>
                  <td className='py-3 pr-4'>{signup.guestCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {signups.length === 0 && (
            <p className='mt-4 text-sm text-[var(--muted)]'>Nenhuma inscricao registrada ainda.</p>
          )}
        </section>

        <section className='glass-card overflow-x-auto p-5'>
          <h2 className='text-xl font-display uppercase tracking-[0.08em]'>Pedidos de Contratacao</h2>
          <table className='mt-4 min-w-full text-left text-sm'>
            <thead className='text-xs uppercase tracking-[0.08em] text-[var(--muted)]'>
              <tr>
                <th className='pb-2 pr-4'>Data</th>
                <th className='pb-2 pr-4'>Nome</th>
                <th className='pb-2 pr-4'>Tipo</th>
                <th className='pb-2 pr-4'>Data Evento</th>
                <th className='pb-2 pr-4'>Cidade</th>
                <th className='pb-2 pr-4'>Contato</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className='border-t border-white/10'>
                  <td className='py-3 pr-4'>
                    {new Date(booking.createdAt).toLocaleString('pt-BR')}
                  </td>
                  <td className='py-3 pr-4'>{booking.name}</td>
                  <td className='py-3 pr-4'>{booking.eventType}</td>
                  <td className='py-3 pr-4'>{booking.eventDate || '-'}</td>
                  <td className='py-3 pr-4'>{booking.city || '-'}</td>
                  <td className='py-3 pr-4'>
                    {booking.email || '-'}
                    {booking.phone ? ` / ${booking.phone}` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <p className='mt-4 text-sm text-[var(--muted)]'>Nenhum pedido de contratacao ainda.</p>
          )}
        </section>

        <section className='glass-card p-6'>
          <div className='flex flex-col justify-between gap-4 md:flex-row md:items-start'>
            <div>
              <h2 className='text-xl font-display uppercase tracking-[0.08em]'>Conteudo do Site</h2>
              <p className='mt-2 text-sm text-[var(--muted)]'>
                Edite eventos, galeria e foto destaque. Salva em S3 e atualiza sem redeploy.
              </p>
              {siteContent?.updatedAt && (
                <p className='mt-2 text-xs uppercase tracking-[0.12em] text-[var(--muted)]'>
                  Ultima atualizacao: {new Date(siteContent.updatedAt).toLocaleString('pt-BR')}
                </p>
              )}
            </div>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <button
                type='button'
                className='btn-secondary'
                onClick={loadSiteContent}
                disabled={!accessKey || siteContentState.kind === 'loading'}
              >
                {siteContentState.kind === 'loading' ? 'Carregando...' : 'Carregar Conteudo'}
              </button>
              <button
                type='button'
                className='btn-primary'
                onClick={saveSiteContent}
                disabled={!accessKey || !siteContent || siteContentState.kind === 'loading'}
              >
                {siteContentState.kind === 'loading' ? 'Salvando...' : 'Salvar Conteudo'}
              </button>
            </div>
          </div>

          {siteContentState.kind === 'error' && (
            <p className='mt-3 text-sm text-rose-300'>{siteContentState.message}</p>
          )}

          {siteContent && (
            <div className='mt-6 space-y-6'>
              <article className='rounded-2xl border border-white/15 bg-white/5 p-5'>
                <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
                  <div>
                    <h3 className='text-lg font-display uppercase tracking-[0.08em]'>Foto Destaque</h3>
                    <p className='mt-1 text-sm text-[var(--muted)]'>
                      Lista de imagens rotativas na primeira dobra.
                    </p>
                  </div>
                  <button type='button' className='btn-secondary md:w-auto' onClick={addHeroImage}>
                    Adicionar Foto
                  </button>
                </div>

                <div className='mt-4 space-y-3'>
                  {siteContent.heroImages.map((image, index) => (
                    <div
                      key={`hero-${index}`}
                      className='grid gap-3 rounded-2xl border border-white/10 bg-black/10 p-4 md:grid-cols-[1.6fr_1fr_auto]'
                    >
                      <input
                        className='field'
                        value={image.src}
                        onChange={(event) => updateHeroImage(index, { src: event.target.value })}
                        placeholder='URL ou caminho (ex: /gallery/real/ana-profile-djanemag.jpeg)'
                      />
                      <input
                        className='field'
                        value={image.alt}
                        onChange={(event) => updateHeroImage(index, { alt: event.target.value })}
                        placeholder='Texto alternativo'
                      />
                      <div className='flex flex-wrap gap-2 md:justify-end'>
                        <button
                          type='button'
                          className='btn-secondary'
                          onClick={() => moveHeroImage(index, index - 1)}
                          disabled={index === 0}
                        >
                          Subir
                        </button>
                        <button
                          type='button'
                          className='btn-secondary'
                          onClick={() => moveHeroImage(index, index + 1)}
                          disabled={index === siteContent.heroImages.length - 1}
                        >
                          Descer
                        </button>
                        <button
                          type='button'
                          className='btn-secondary'
                          onClick={() => removeHeroImage(index)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className='rounded-2xl border border-white/15 bg-white/5 p-5'>
                <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
                  <div>
                    <h3 className='text-lg font-display uppercase tracking-[0.08em]'>Galeria</h3>
                    <p className='mt-1 text-sm text-[var(--muted)]'>Imagens exibidas na secao Galeria.</p>
                  </div>
                  <button type='button' className='btn-secondary md:w-auto' onClick={addGalleryImage}>
                    Adicionar Foto
                  </button>
                </div>

                <div className='mt-4 space-y-3'>
                  {siteContent.galleryImages.map((image, index) => (
                    <div
                      key={`gallery-${index}`}
                      className='grid gap-3 rounded-2xl border border-white/10 bg-black/10 p-4 md:grid-cols-[1.6fr_1fr_auto]'
                    >
                      <input
                        className='field'
                        value={image.src}
                        onChange={(event) => updateGalleryImage(index, { src: event.target.value })}
                        placeholder='URL ou caminho (ex: /gallery/real/ana-zamna-festival.jpeg)'
                      />
                      <input
                        className='field'
                        value={image.alt}
                        onChange={(event) => updateGalleryImage(index, { alt: event.target.value })}
                        placeholder='Legenda/alt'
                      />
                      <div className='flex flex-wrap gap-2 md:justify-end'>
                        <button
                          type='button'
                          className='btn-secondary'
                          onClick={() => moveGalleryImage(index, index - 1)}
                          disabled={index === 0}
                        >
                          Subir
                        </button>
                        <button
                          type='button'
                          className='btn-secondary'
                          onClick={() => moveGalleryImage(index, index + 1)}
                          disabled={index === siteContent.galleryImages.length - 1}
                        >
                          Descer
                        </button>
                        <button
                          type='button'
                          className='btn-secondary'
                          onClick={() => removeGalleryImage(index)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className='rounded-2xl border border-white/15 bg-white/5 p-5'>
                <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
                  <div>
                    <h3 className='text-lg font-display uppercase tracking-[0.08em]'>Eventos</h3>
                    <p className='mt-1 text-sm text-[var(--muted)]'>
                      Cada evento vira uma pagina em /eventos/SEU-SLUG e aceita inscricoes.
                    </p>
                  </div>
                  <button type='button' className='btn-secondary md:w-auto' onClick={addEvent}>
                    Adicionar Evento
                  </button>
                </div>

                <div className='mt-4 space-y-3'>
                  {siteContent.events.map((event, index) => (
                    <details
                      key={`${event.slug || 'novo'}-${index}`}
                      className='rounded-2xl border border-white/10 bg-black/10 p-4'
                    >
                      <summary className='cursor-pointer text-sm font-semibold'>
                        {event.title || '(Sem titulo)'}{' '}
                        <span className='text-[var(--muted)]'>
                          {event.slug ? `• ${event.slug}` : '• sem-slug'}
                          {event.signupOpen === false ? ' • lista encerrada' : ''}
                        </span>
                      </summary>

                      <div className='mt-4 grid gap-3 md:grid-cols-2'>
                        <input
                          className='field'
                          value={event.slug}
                          onChange={(e) => updateEvent(index, { slug: e.target.value })}
                          placeholder='slug (ex: aniversario-ana-jones-2026)'
                        />
                        <input
                          className='field'
                          value={event.title}
                          onChange={(e) => updateEvent(index, { title: e.target.value })}
                          placeholder='Titulo'
                        />
                        <input
                          className='field'
                          value={event.dateIso}
                          onChange={(e) => updateEvent(index, { dateIso: e.target.value })}
                          placeholder='Data ISO (YYYY-MM-DD)'
                        />
                        <input
                          className='field'
                          value={event.dateLabel}
                          onChange={(e) => updateEvent(index, { dateLabel: e.target.value })}
                          placeholder='Data (ex: 14 de fevereiro de 2026)'
                        />
                        <input
                          className='field'
                          value={event.timeLabel}
                          onChange={(e) => updateEvent(index, { timeLabel: e.target.value })}
                          placeholder='Horario (ex: 16h)'
                        />
                        <input
                          className='field'
                          value={event.location}
                          onChange={(e) => updateEvent(index, { location: e.target.value })}
                          placeholder='Local'
                        />
                        <input
                          className='field'
                          value={event.city}
                          onChange={(e) => updateEvent(index, { city: e.target.value })}
                          placeholder='Cidade (ex: Brasilia - DF)'
                        />
                        <input
                          className='field md:col-span-2'
                          value={event.coverImage}
                          onChange={(e) => updateEvent(index, { coverImage: e.target.value })}
                          placeholder='Imagem de capa (ex: /gallery/real/ana-zamna-festival.jpeg)'
                        />
                        <label className='flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-[var(--muted)] md:col-span-2'>
                          <input
                            type='checkbox'
                            checked={event.signupOpen !== false}
                            onChange={(e) => updateEvent(index, { signupOpen: e.target.checked })}
                          />
                          Lista aberta (aceitar inscricoes)
                        </label>
                        <input
                          className='field md:col-span-2'
                          value={event.signupClosedMessage || ''}
                          onChange={(e) =>
                            updateEvent(index, { signupClosedMessage: e.target.value })
                          }
                          placeholder='Mensagem quando a lista estiver encerrada (opcional)'
                        />
                        <textarea
                          className='field md:col-span-2'
                          rows={4}
                          value={event.description}
                          onChange={(e) => updateEvent(index, { description: e.target.value })}
                          placeholder='Descricao'
                        />
                        <textarea
                          className='field md:col-span-2'
                          rows={4}
                          value={event.highlights.join('\n')}
                          onChange={(e) =>
                            updateEvent(index, {
                              highlights: e.target.value
                                .split('\n')
                                .map((line) => line.trim())
                                .filter((line) => line.length > 0),
                            })
                          }
                          placeholder='Destaques (1 por linha)'
                        />
                        <textarea
                          className='field md:col-span-2'
                          rows={4}
                          value={event.listRules.join('\n')}
                          onChange={(e) =>
                            updateEvent(index, {
                              listRules: e.target.value
                                .split('\n')
                                .map((line) => line.trim())
                                .filter((line) => line.length > 0),
                            })
                          }
                          placeholder='Regras da lista (1 por linha)'
                        />
                      </div>

                      <div className='mt-4 flex justify-end'>
                        <button
                          type='button'
                          className='btn-secondary'
                          onClick={() => removeEvent(index)}
                        >
                          Remover Evento
                        </button>
                      </div>
                    </details>
                  ))}
                </div>
              </article>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
