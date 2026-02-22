'use client';

import { useState } from 'react';

import { useAdminAuth } from '@/lib/useAdminAuth';
import { AdminToast } from './AdminToast';

type Tab = 'overview' | 'signups' | 'bookings' | 'content' | 'profile';

type TabConfig = {
    key: Tab;
    label: string;
    icon: string;
};

const TABS: TabConfig[] = [
    { key: 'overview', label: 'Visão Geral', icon: '📊' },
    { key: 'signups', label: 'Inscrições', icon: '📋' },
    { key: 'bookings', label: 'Contratações', icon: '🎤' },
    { key: 'content', label: 'Conteúdo', icon: '🎨' },
    { key: 'profile', label: 'Perfil', icon: '⚙️' },
];

type Props = {
    children: (activeTab: Tab, accessKey: string, fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>) => React.ReactNode;
};

export const AdminLayout = ({ children }: Props) => {
    const { logout, accessKey, fetchWithAuth } = useAdminAuth();
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    return (
        <div className='flex min-h-screen bg-[var(--bg)]'>
            {/* Sidebar — desktop */}
            <aside className='admin-sidebar hidden w-64 flex-shrink-0 border-r border-white/10 bg-[rgba(8,10,19,0.9)] md:flex md:flex-col'>
                <div className='border-b border-white/10 p-6'>
                    <h1 className='font-display text-xl uppercase tracking-[0.1em] text-[var(--brand-cream)]'>
                        Admin
                    </h1>
                    <p className='mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-[var(--muted)]'>
                        DJ Ana Jones
                    </p>
                </div>

                <nav className='flex-1 space-y-1 p-3'>
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type='button'
                            onClick={() => setActiveTab(tab.key)}
                            className={`admin-tab w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${activeTab === tab.key
                                ? 'bg-white/10 text-[var(--brand-cream)] shadow-sm'
                                : 'text-[var(--muted)] hover:bg-white/5 hover:text-[var(--brand-cream)]'
                                }`}
                        >
                            <span className='mr-3'>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className='border-t border-white/10 p-4'>
                    <button
                        type='button'
                        onClick={logout}
                        className='w-full rounded-xl px-4 py-2.5 text-left text-xs font-medium uppercase tracking-[0.1em] text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-rose-300'
                    >
                        ← Sair
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className='flex flex-1 flex-col'>
                {/* Mobile header */}
                <header className='flex items-center justify-between border-b border-white/10 bg-[rgba(8,10,19,0.9)] px-4 py-3 md:hidden'>
                    <div>
                        <h1 className='font-display text-lg uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                            Admin
                        </h1>
                    </div>
                    <button
                        type='button'
                        onClick={logout}
                        className='text-xs font-medium uppercase tracking-[0.08em] text-[var(--muted)] hover:text-rose-300'
                    >
                        Sair
                    </button>
                </header>

                {/* Desktop header */}
                <header className='hidden border-b border-white/10 bg-[rgba(8,10,19,0.5)] px-8 py-4 md:flex md:items-center md:justify-between'>
                    <h2 className='font-display text-lg uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                        {TABS.find((t) => t.key === activeTab)?.label}
                    </h2>
                    <a
                        href='/'
                        target='_blank'
                        rel='noreferrer'
                        className='text-xs font-medium uppercase tracking-[0.1em] text-[var(--brand-cyan)] hover:opacity-80'
                    >
                        Ver Site →
                    </a>
                </header>

                {/* Page content */}
                <main className='flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8'>
                    {children(activeTab, accessKey, fetchWithAuth)}
                </main>

                {/* Mobile bottom nav */}
                <nav className='flex border-t border-white/10 bg-[rgba(8,10,19,0.95)] md:hidden'>
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type='button'
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex flex-1 flex-col items-center gap-1 py-3 text-[0.6rem] font-medium uppercase tracking-[0.06em] transition-colors ${activeTab === tab.key
                                ? 'text-[var(--brand-cyan)]'
                                : 'text-[var(--muted)]'
                                }`}
                        >
                            <span className='text-base'>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <AdminToast />
        </div>
    );
};

export type { Tab };
