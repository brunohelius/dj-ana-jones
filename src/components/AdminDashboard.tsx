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

type LoadState = {
  kind: 'idle' | 'loading' | 'loaded' | 'error';
  message?: string;
};

export const AdminDashboard = () => {
  const [accessKey, setAccessKey] = useState('');
  const [signups, setSignups] = useState<EventSignup[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [state, setState] = useState<LoadState>({ kind: 'idle' });

  const totalGuests = useMemo(() => {
    return signups.reduce((acc, item) => acc + 1 + item.guestCount, 0);
  }, [signups]);

  const loadData = async () => {
    setState({ kind: 'loading' });

    try {
      const [signupsResponse, bookingsResponse] = await Promise.all([
        fetch('/api/event-signups', {
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

  return (
    <main className='min-h-screen bg-[var(--bg)] px-4 py-10 text-[var(--brand-cream)] md:px-10'>
      <div className='mx-auto max-w-6xl space-y-6'>
        <header className='glass-card p-6'>
          <h1 className='text-3xl font-display uppercase tracking-[0.08em]'>
            Painel Admin - DJ Ana Jones
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
      </div>
    </main>
  );
};
