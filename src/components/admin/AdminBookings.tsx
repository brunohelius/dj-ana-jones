'use client';

import { useCallback, useEffect, useState } from 'react';

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

export const AdminBookings = ({ fetchWithAuth }: Props) => {
    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetchWithAuth('/api/booking-requests');

            if (!response.ok) {
                setError('Falha ao carregar pedidos.');
                return;
            }

            const body = (await response.json()) as { data: BookingRequest[] };
            setBookings(body.data || []);
        } catch {
            setError('Erro ao conectar.');
        } finally {
            setLoading(false);
        }
    }, [fetchWithAuth]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className='space-y-6'>
            {/* Stats */}
            <div className='flex flex-wrap gap-4'>
                <div className='glass-card flex items-center gap-3 px-5 py-3'>
                    <span className='text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Total:</span>
                    <span className='font-display text-xl text-[var(--brand-cream)]'>{bookings.length}</span>
                </div>
                <button type='button' className='btn-secondary' onClick={loadData}>
                    Atualizar
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
            ) : bookings.length === 0 ? (
                <div className='glass-card p-6 text-center'>
                    <p className='text-sm text-[var(--muted)]'>Nenhum pedido de contratação ainda.</p>
                </div>
            ) : (
                <div className='space-y-3'>
                    {bookings
                        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                        .map((b) => {
                            const isExpanded = expandedId === b.id;

                            return (
                                <article
                                    key={b.id}
                                    className='glass-card overflow-hidden transition-all'
                                >
                                    <button
                                        type='button'
                                        className='flex w-full items-center gap-4 p-5 text-left'
                                        onClick={() => setExpandedId(isExpanded ? null : b.id)}
                                    >
                                        <div className='flex-1'>
                                            <div className='flex flex-wrap items-center gap-3'>
                                                <span className='font-medium text-[var(--brand-cream)]'>{b.name}</span>
                                                <span className='rounded-full bg-white/10 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.08em] text-[var(--muted)]'>
                                                    {b.eventType}
                                                </span>
                                            </div>
                                            <p className='mt-1 text-xs text-[var(--muted)]'>
                                                {new Date(b.createdAt).toLocaleString('pt-BR')}
                                                {b.city ? ` • ${b.city}` : ''}
                                                {b.eventDate ? ` • ${b.eventDate}` : ''}
                                            </p>
                                        </div>
                                        <span className='text-xs text-[var(--muted)]'>{isExpanded ? '▲' : '▼'}</span>
                                    </button>

                                    {isExpanded && (
                                        <div className='border-t border-white/10 px-5 py-4'>
                                            <div className='grid gap-3 text-sm sm:grid-cols-2'>
                                                <div>
                                                    <p className='text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Email</p>
                                                    <p className='mt-1 text-[var(--brand-cream)]'>{b.email || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className='text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Telefone</p>
                                                    <p className='mt-1 text-[var(--brand-cream)]'>{b.phone || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className='text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Tipo</p>
                                                    <p className='mt-1 text-[var(--brand-cream)]'>{b.eventType}</p>
                                                </div>
                                                <div>
                                                    <p className='text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Data Evento</p>
                                                    <p className='mt-1 text-[var(--brand-cream)]'>{b.eventDate || '-'}</p>
                                                </div>
                                            </div>
                                            {b.message && (
                                                <div className='mt-4'>
                                                    <p className='text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Mensagem</p>
                                                    <p className='mt-1 whitespace-pre-wrap text-sm leading-relaxed text-[var(--brand-cream)]'>
                                                        {b.message}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                </div>
            )}
        </div>
    );
};
