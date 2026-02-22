'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

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

type Props = {
    fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
};

export const AdminOverview = ({ fetchWithAuth }: Props) => {
    const [signups, setSignups] = useState<EventSignup[]>([]);
    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const totalGuests = useMemo(
        () => signups.reduce((acc, s) => acc + 1 + s.guestCount, 0),
        [signups],
    );

    const loadData = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const [signupsRes, bookingsRes] = await Promise.all([
                fetchWithAuth('/api/event-signups'),
                fetchWithAuth('/api/booking-requests'),
            ]);

            if (!signupsRes.ok || !bookingsRes.ok) {
                setError('Falha ao carregar dados. Verifique sua chave de acesso.');
                return;
            }

            const [signupsBody, bookingsBody] = (await Promise.all([
                signupsRes.json(),
                bookingsRes.json(),
            ])) as [{ data: EventSignup[] }, { data: BookingRequest[] }];

            setSignups(signupsBody.data || []);
            setBookings(bookingsBody.data || []);
        } catch {
            setError('Erro ao conectar com o servidor.');
        } finally {
            setLoading(false);
        }
    }, [fetchWithAuth]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) {
        return (
            <div className='flex items-center justify-center py-20'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--brand-cyan)]' />
            </div>
        );
    }

    if (error) {
        return (
            <div className='glass-card p-6 text-center'>
                <p className='text-sm text-rose-300'>{error}</p>
                <button type='button' className='btn-secondary mt-4' onClick={loadData}>
                    Tentar Novamente
                </button>
            </div>
        );
    }

    const recentSignups = [...signups]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5);

    const recentBookings = [...bookings]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5);

    return (
        <div className='space-y-6'>
            {/* KPI Cards */}
            <section className='grid gap-4 sm:grid-cols-3'>
                <article className='glass-card overflow-hidden'>
                    <div className='h-1 bg-gradient-to-r from-[var(--brand-orange)] to-orange-400' />
                    <div className='p-5'>
                        <p className='text-xs uppercase tracking-[0.12em] text-[var(--muted)]'>Inscrições</p>
                        <p className='mt-2 font-display text-4xl text-[var(--brand-cream)]'>{signups.length}</p>
                    </div>
                </article>
                <article className='glass-card overflow-hidden'>
                    <div className='h-1 bg-gradient-to-r from-[var(--brand-cyan)] to-cyan-400' />
                    <div className='p-5'>
                        <p className='text-xs uppercase tracking-[0.12em] text-[var(--muted)]'>Público Estimado</p>
                        <p className='mt-2 font-display text-4xl text-[var(--brand-cream)]'>{totalGuests}</p>
                    </div>
                </article>
                <article className='glass-card overflow-hidden'>
                    <div className='h-1 bg-gradient-to-r from-purple-500 to-violet-400' />
                    <div className='p-5'>
                        <p className='text-xs uppercase tracking-[0.12em] text-[var(--muted)]'>Pedidos de Show</p>
                        <p className='mt-2 font-display text-4xl text-[var(--brand-cream)]'>{bookings.length}</p>
                    </div>
                </article>
            </section>

            {/* Recent tables */}
            <div className='grid gap-6 lg:grid-cols-2'>
                <section className='glass-card p-5'>
                    <h3 className='font-display text-lg uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                        Últimas Inscrições
                    </h3>
                    {recentSignups.length === 0 ? (
                        <p className='mt-4 text-sm text-[var(--muted)]'>Nenhuma inscrição ainda.</p>
                    ) : (
                        <div className='mt-4 overflow-x-auto'>
                            <table className='min-w-full text-left text-sm'>
                                <thead className='text-xs uppercase tracking-[0.08em] text-[var(--muted)]'>
                                    <tr>
                                        <th className='pb-2 pr-4'>Data</th>
                                        <th className='pb-2 pr-4'>Nome</th>
                                        <th className='pb-2 pr-4'>Evento</th>
                                        <th className='pb-2'>Acomp.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentSignups.map((s) => (
                                        <tr key={s.id} className='border-t border-white/10'>
                                            <td className='py-2.5 pr-4 text-xs text-[var(--muted)]'>
                                                {new Date(s.createdAt).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className='py-2.5 pr-4'>{s.name}</td>
                                            <td className='py-2.5 pr-4 text-xs text-[var(--muted)]'>{s.eventSlug}</td>
                                            <td className='py-2.5'>{s.guestCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section className='glass-card p-5'>
                    <h3 className='font-display text-lg uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                        Últimos Pedidos
                    </h3>
                    {recentBookings.length === 0 ? (
                        <p className='mt-4 text-sm text-[var(--muted)]'>Nenhum pedido ainda.</p>
                    ) : (
                        <div className='mt-4 overflow-x-auto'>
                            <table className='min-w-full text-left text-sm'>
                                <thead className='text-xs uppercase tracking-[0.08em] text-[var(--muted)]'>
                                    <tr>
                                        <th className='pb-2 pr-4'>Data</th>
                                        <th className='pb-2 pr-4'>Nome</th>
                                        <th className='pb-2 pr-4'>Tipo</th>
                                        <th className='pb-2'>Cidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map((b) => (
                                        <tr key={b.id} className='border-t border-white/10'>
                                            <td className='py-2.5 pr-4 text-xs text-[var(--muted)]'>
                                                {new Date(b.createdAt).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className='py-2.5 pr-4'>{b.name}</td>
                                            <td className='py-2.5 pr-4 text-xs text-[var(--muted)]'>{b.eventType}</td>
                                            <td className='py-2.5 text-xs text-[var(--muted)]'>{b.city || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};
