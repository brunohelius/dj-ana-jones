'use client';

import { useState } from 'react';

import { useAdminAuth } from '@/lib/useAdminAuth';

type Props = {
    children: React.ReactNode;
};

export const AdminLoginGate = ({ children }: Props) => {
    const { isAuthenticated, ready, login } = useAdminAuth();
    const [inputKey, setInputKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!ready) {
        return (
            <main className='flex min-h-screen items-center justify-center bg-[var(--bg)]'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--brand-cyan)]' />
            </main>
        );
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    const handleLogin = async () => {
        const trimmed = inputKey.trim();

        if (!trimmed) {
            setError('Insira a chave de acesso.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/site-content', {
                headers: { 'x-admin-key': trimmed },
                cache: 'no-store',
            });

            if (response.ok) {
                login(trimmed);
            } else {
                setError('Chave inválida. Verifique e tente novamente.');
            }
        } catch {
            setError('Falha ao conectar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg)] px-4'>
            <div className='pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[rgba(255,107,53,0.2)] blur-[100px]' />
            <div className='pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-[rgba(51,225,237,0.15)] blur-[80px]' />

            <div className='relative z-10 w-full max-w-sm'>
                <div className='glass-card p-8'>
                    <div className='text-center'>
                        <h1 className='font-display text-3xl uppercase tracking-[0.1em] text-[var(--brand-cream)]'>
                            Admin
                        </h1>
                        <p className='mt-2 text-xs uppercase tracking-[0.16em] text-[var(--muted)]'>
                            DJ Ana Jones
                        </p>
                    </div>

                    <div className='mt-8 space-y-4'>
                        <div>
                            <label
                                htmlFor='admin-key'
                                className='mb-2 block text-xs uppercase tracking-[0.12em] text-[var(--muted)]'
                            >
                                Chave de Acesso
                            </label>
                            <input
                                id='admin-key'
                                type='password'
                                className='field'
                                value={inputKey}
                                onChange={(e) => setInputKey(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleLogin();
                                    }
                                }}
                                placeholder='ADMIN_DASHBOARD_KEY'
                                autoFocus
                            />
                        </div>

                        {error && (
                            <p className='text-sm text-rose-300'>{error}</p>
                        )}

                        <button
                            type='button'
                            className='btn-primary w-full'
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? 'Verificando...' : 'Entrar'}
                        </button>
                    </div>
                </div>

                <p className='mt-6 text-center text-xs text-[var(--muted)]/60'>
                    anajonesdj.com • painel administrativo
                </p>
            </div>
        </main>
    );
};
