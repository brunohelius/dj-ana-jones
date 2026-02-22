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

type Props = {
    accessKey: string;
    fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
};

export const AdminSignups = ({ accessKey, fetchWithAuth }: Props) => {
    const [signups, setSignups] = useState<EventSignup[]>([]);
    const [eventSlug, setEventSlug] = useState('');
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
            const url = `/api/event-signups${eventSlug ? `?eventSlug=${encodeURIComponent(eventSlug)}` : ''}`;
            const response = await fetchWithAuth(url);

            if (!response.ok) {
                setError('Falha ao carregar inscrições.');
                return;
            }

            const body = (await response.json()) as { data: EventSignup[] };
            setSignups(body.data || []);
        } catch {
            setError('Erro ao conectar.');
        } finally {
            setLoading(false);
        }
    }, [fetchWithAuth, eventSlug]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleExportCSV = () => {
        const url = `/api/event-signups?adminKey=${encodeURIComponent(accessKey)}&format=csv${eventSlug ? `&eventSlug=${encodeURIComponent(eventSlug)}` : ''}`;
        window.location.assign(url);
    };

    return (
        <div className='space-y-6'>
            {/* Stats bar */}
            <div className='flex flex-wrap gap-4'>
                <div className='glass-card flex items-center gap-3 px-5 py-3'>
                    <span className='text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Total:</span>
                    <span className='font-display text-xl text-[var(--brand-cream)]'>{signups.length}</span>
                </div>
                <div className='glass-card flex items-center gap-3 px-5 py-3'>
                    <span className='text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Público:</span>
                    <span className='font-display text-xl text-[var(--brand-cyan)]'>{totalGuests}</span>
                </div>
            </div>

            {/* Filters */}
            <div className='flex flex-wrap gap-3'>
                <input
                    className='field w-full md:max-w-xs'
                    value={eventSlug}
                    onChange={(e) => setEventSlug(e.target.value)}
                    placeholder='Filtrar por slug do evento'
                />
                <button type='button' className='btn-secondary' onClick={loadData}>
                    Atualizar
                </button>
                <button
                    type='button'
                    className='btn-secondary'
                    onClick={handleExportCSV}
                    disabled={signups.length === 0}
                >
                    Exportar CSV
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className='flex items-center justify-center py-16'>
                    <div className='h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--brand-cyan)]' />
                </div>
            ) : error ? (
                <div className='glass-card p-6 text-center'>
                    <p className='text-sm text-rose-300'>{error}</p>
                </div>
            ) : (
                <section className='glass-card overflow-x-auto p-5'>
                    {signups.length === 0 ? (
                        <p className='text-sm text-[var(--muted)]'>Nenhuma inscrição encontrada.</p>
                    ) : (
                        <table className='min-w-full text-left text-sm'>
                            <thead className='text-xs uppercase tracking-[0.08em] text-[var(--muted)]'>
                                <tr>
                                    <th className='pb-2 pr-4'>Data</th>
                                    <th className='pb-2 pr-4'>Evento</th>
                                    <th className='pb-2 pr-4'>Nome</th>
                                    <th className='pb-2 pr-4'>Contato</th>
                                    <th className='pb-2 pr-4'>Cidade</th>
                                    <th className='pb-2 pr-4'>Acomp.</th>
                                    <th className='pb-2'>Obs.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {signups.map((s) => (
                                    <tr key={s.id} className='border-t border-white/10'>
                                        <td className='py-3 pr-4 text-xs text-[var(--muted)]'>
                                            {new Date(s.createdAt).toLocaleString('pt-BR')}
                                        </td>
                                        <td className='py-3 pr-4 text-xs'>{s.eventSlug}</td>
                                        <td className='py-3 pr-4'>{s.name}</td>
                                        <td className='py-3 pr-4 text-xs text-[var(--muted)]'>
                                            {s.email || '-'}
                                            {s.phone ? ` / ${s.phone}` : ''}
                                        </td>
                                        <td className='py-3 pr-4 text-xs text-[var(--muted)]'>{s.city || '-'}</td>
                                        <td className='py-3 pr-4'>{s.guestCount}</td>
                                        <td className='py-3 text-xs text-[var(--muted)]'>{s.notes || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            )}
        </div>
    );
};
