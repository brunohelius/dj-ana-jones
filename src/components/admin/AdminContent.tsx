'use client';

import { useCallback, useState } from 'react';

import { AdminConfirmDialog } from './AdminConfirmDialog';
import { showToast } from './AdminToast';

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

type ConfirmState = {
    title: string;
    message: string;
    onConfirm: () => void;
} | null;

type Props = {
    fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
};

export const AdminContent = ({ fetchWithAuth }: Props) => {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [confirm, setConfirm] = useState<ConfirmState>(null);

    const loadContent = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetchWithAuth('/api/site-content');

            if (!response.ok) {
                setError('Falha ao carregar conteúdo.');
                return;
            }

            const body = (await response.json()) as { data: SiteContent };
            setContent(body.data);
            showToast('Conteúdo carregado.', 'success');
        } catch {
            setError('Erro ao conectar.');
        } finally {
            setLoading(false);
        }
    }, [fetchWithAuth]);

    const saveContent = async () => {
        if (!content) return;

        setSaving(true);

        try {
            const response = await fetchWithAuth('/api/site-content', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content),
            });

            if (!response.ok) {
                showToast('Falha ao salvar. Tente novamente.', 'error');
                return;
            }

            const body = (await response.json()) as { data: SiteContent };
            setContent(body.data);
            showToast('Conteúdo salvo com sucesso!', 'success');
        } catch {
            showToast('Erro de conexão ao salvar.', 'error');
        } finally {
            setSaving(false);
        }
    };

    // --- Hero Images ---
    const updateHeroImage = (index: number, patch: Partial<SiteImage>) => {
        setContent((prev) => {
            if (!prev) return prev;
            const next = [...prev.heroImages];
            next[index] = { ...next[index], ...patch };
            return { ...prev, heroImages: next };
        });
    };

    const moveHeroImage = (from: number, to: number) => {
        setContent((prev) => {
            if (!prev || to < 0 || to >= prev.heroImages.length || from === to) return prev;
            const next = [...prev.heroImages];
            const [item] = next.splice(from, 1);
            next.splice(to, 0, item);
            return { ...prev, heroImages: next };
        });
    };

    const removeHeroImage = (index: number) => {
        setConfirm({
            title: 'Remover Foto Destaque',
            message: 'Tem certeza que deseja remover esta imagem do destaque?',
            onConfirm: () => {
                setContent((prev) => {
                    if (!prev) return prev;
                    return { ...prev, heroImages: prev.heroImages.filter((_, i) => i !== index) };
                });
            },
        });
    };

    const addHeroImage = () => {
        setContent((prev) => {
            if (!prev) return prev;
            return { ...prev, heroImages: [...prev.heroImages, { src: '', alt: 'Ana Jones' }] };
        });
    };

    // --- Gallery Images ---
    const updateGalleryImage = (index: number, patch: Partial<SiteImage>) => {
        setContent((prev) => {
            if (!prev) return prev;
            const next = [...prev.galleryImages];
            next[index] = { ...next[index], ...patch };
            return { ...prev, galleryImages: next };
        });
    };

    const moveGalleryImage = (from: number, to: number) => {
        setContent((prev) => {
            if (!prev || to < 0 || to >= prev.galleryImages.length || from === to) return prev;
            const next = [...prev.galleryImages];
            const [item] = next.splice(from, 1);
            next.splice(to, 0, item);
            return { ...prev, galleryImages: next };
        });
    };

    const removeGalleryImage = (index: number) => {
        setConfirm({
            title: 'Remover Foto da Galeria',
            message: 'Tem certeza que deseja remover esta imagem da galeria?',
            onConfirm: () => {
                setContent((prev) => {
                    if (!prev) return prev;
                    return { ...prev, galleryImages: prev.galleryImages.filter((_, i) => i !== index) };
                });
            },
        });
    };

    const addGalleryImage = () => {
        setContent((prev) => {
            if (!prev) return prev;
            return { ...prev, galleryImages: [...prev.galleryImages, { src: '', alt: 'Ana Jones' }] };
        });
    };

    // --- Events ---
    const updateEvent = (index: number, patch: Partial<SiteEvent>) => {
        setContent((prev) => {
            if (!prev) return prev;
            const next = [...prev.events];
            next[index] = { ...next[index], ...patch };
            return { ...prev, events: next };
        });
    };

    const removeEvent = (index: number) => {
        const eventTitle = content?.events[index]?.title || 'este evento';
        setConfirm({
            title: 'Remover Evento',
            message: `Tem certeza que deseja remover "${eventTitle}"? Esta ação não pode ser desfeita após salvar.`,
            onConfirm: () => {
                setContent((prev) => {
                    if (!prev) return prev;
                    return { ...prev, events: prev.events.filter((_, i) => i !== index) };
                });
            },
        });
    };

    const addEvent = () => {
        setContent((prev) => {
            if (!prev) return prev;
            const seedCover =
                prev.heroImages.find((i) => i.src.trim().length > 0)?.src ||
                prev.galleryImages.find((i) => i.src.trim().length > 0)?.src ||
                '/gallery/real/ana-profile-djanemag.jpeg';
            return {
                ...prev,
                events: [
                    ...prev.events,
                    {
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
                    },
                ],
            };
        });
    };

    // Preview helper
    const ImagePreview = ({ src }: { src: string }) => {
        if (!src || src.trim().length === 0) return null;

        return (
            <div className='mt-2 h-16 w-24 overflow-hidden rounded-lg border border-white/10'>
                <img
                    src={src}
                    alt='preview'
                    className='h-full w-full object-cover'
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
            </div>
        );
    };

    // --- Not loaded yet ---
    if (!content) {
        return (
            <div className='space-y-4'>
                <div className='glass-card p-6'>
                    <h3 className='font-display text-xl uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                        Conteúdo do Site
                    </h3>
                    <p className='mt-2 text-sm text-[var(--muted)]'>
                        Edite events, galeria e foto destaque. As alterações são salvas no S3 e aplicadas sem redeploy.
                    </p>
                    {error && <p className='mt-3 text-sm text-rose-300'>{error}</p>}
                    <button
                        type='button'
                        className='btn-primary mt-5'
                        onClick={loadContent}
                        disabled={loading}
                    >
                        {loading ? 'Carregando...' : 'Carregar Conteúdo'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Header with save button */}
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <h3 className='font-display text-xl uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                        Conteúdo do Site
                    </h3>
                    {content.updatedAt && (
                        <p className='mt-1 text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>
                            Última atualização: {new Date(content.updatedAt).toLocaleString('pt-BR')}
                        </p>
                    )}
                </div>
                <div className='flex gap-3'>
                    <button type='button' className='btn-secondary' onClick={loadContent} disabled={loading}>
                        {loading ? 'Carregando...' : 'Recarregar'}
                    </button>
                    <button type='button' className='btn-primary' onClick={saveContent} disabled={saving}>
                        {saving ? 'Salvando...' : 'Salvar Conteúdo'}
                    </button>
                </div>
            </div>

            {/* Hero Images */}
            <section className='rounded-2xl border border-white/15 bg-white/5 p-5'>
                <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
                    <div>
                        <h4 className='font-display text-lg uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                            Foto Destaque
                        </h4>
                        <p className='mt-1 text-sm text-[var(--muted)]'>
                            Imagens rotativas na primeira dobra — {content.heroImages.length} fotos.
                        </p>
                    </div>
                    <button type='button' className='btn-secondary md:w-auto' onClick={addHeroImage}>
                        + Adicionar
                    </button>
                </div>

                <div className='mt-4 space-y-3'>
                    {content.heroImages.map((image, index) => (
                        <div
                            key={`hero-${index}`}
                            className='rounded-2xl border border-white/10 bg-black/10 p-4'
                        >
                            <div className='grid gap-3 md:grid-cols-[1.6fr_1fr_auto]'>
                                <input
                                    className='field'
                                    value={image.src}
                                    onChange={(e) => updateHeroImage(index, { src: e.target.value })}
                                    placeholder='URL ou caminho (ex: /gallery/real/ana-profile-djanemag.jpeg)'
                                />
                                <input
                                    className='field'
                                    value={image.alt}
                                    onChange={(e) => updateHeroImage(index, { alt: e.target.value })}
                                    placeholder='Texto alternativo'
                                />
                                <div className='flex flex-wrap gap-2 md:justify-end'>
                                    <button
                                        type='button'
                                        className='btn-secondary'
                                        onClick={() => moveHeroImage(index, index - 1)}
                                        disabled={index === 0}
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type='button'
                                        className='btn-secondary'
                                        onClick={() => moveHeroImage(index, index + 1)}
                                        disabled={index === content.heroImages.length - 1}
                                    >
                                        ↓
                                    </button>
                                    <button
                                        type='button'
                                        className='btn-secondary hover:!border-rose-400/60 hover:!text-rose-300'
                                        onClick={() => removeHeroImage(index)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                            <ImagePreview src={image.src} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Gallery */}
            <section className='rounded-2xl border border-white/15 bg-white/5 p-5'>
                <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
                    <div>
                        <h4 className='font-display text-lg uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                            Galeria
                        </h4>
                        <p className='mt-1 text-sm text-[var(--muted)]'>
                            Imagens da seção Galeria — {content.galleryImages.length} fotos.
                        </p>
                    </div>
                    <button type='button' className='btn-secondary md:w-auto' onClick={addGalleryImage}>
                        + Adicionar
                    </button>
                </div>

                <div className='mt-4 space-y-3'>
                    {content.galleryImages.map((image, index) => (
                        <div
                            key={`gallery-${index}`}
                            className='rounded-2xl border border-white/10 bg-black/10 p-4'
                        >
                            <div className='grid gap-3 md:grid-cols-[1.6fr_1fr_auto]'>
                                <input
                                    className='field'
                                    value={image.src}
                                    onChange={(e) => updateGalleryImage(index, { src: e.target.value })}
                                    placeholder='URL ou caminho (ex: /gallery/real/ana-zamna-festival.jpeg)'
                                />
                                <input
                                    className='field'
                                    value={image.alt}
                                    onChange={(e) => updateGalleryImage(index, { alt: e.target.value })}
                                    placeholder='Legenda/alt'
                                />
                                <div className='flex flex-wrap gap-2 md:justify-end'>
                                    <button
                                        type='button'
                                        className='btn-secondary'
                                        onClick={() => moveGalleryImage(index, index - 1)}
                                        disabled={index === 0}
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type='button'
                                        className='btn-secondary'
                                        onClick={() => moveGalleryImage(index, index + 1)}
                                        disabled={index === content.galleryImages.length - 1}
                                    >
                                        ↓
                                    </button>
                                    <button
                                        type='button'
                                        className='btn-secondary hover:!border-rose-400/60 hover:!text-rose-300'
                                        onClick={() => removeGalleryImage(index)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                            <ImagePreview src={image.src} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Events */}
            <section className='rounded-2xl border border-white/15 bg-white/5 p-5'>
                <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
                    <div>
                        <h4 className='font-display text-lg uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                            Eventos
                        </h4>
                        <p className='mt-1 text-sm text-[var(--muted)]'>
                            Cada evento vira uma página em /eventos/SEU-SLUG — {content.events.length} eventos.
                        </p>
                    </div>
                    <button type='button' className='btn-secondary md:w-auto' onClick={addEvent}>
                        + Adicionar Evento
                    </button>
                </div>

                <div className='mt-4 space-y-3'>
                    {content.events.map((event, index) => (
                        <details
                            key={`${event.slug || 'novo'}-${index}`}
                            className='rounded-2xl border border-white/10 bg-black/10 p-4'
                        >
                            <summary className='cursor-pointer text-sm font-semibold'>
                                {event.title || '(Sem título)'}{' '}
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
                                    placeholder='Título'
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
                                    placeholder='Horário (ex: 16h)'
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
                                    placeholder='Cidade (ex: Brasília - DF)'
                                />
                                <input
                                    className='field'
                                    value={event.coverImage}
                                    onChange={(e) => updateEvent(index, { coverImage: e.target.value })}
                                    placeholder='Imagem de capa'
                                />
                                <ImagePreview src={event.coverImage} />

                                <label className='flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-[var(--muted)] md:col-span-2'>
                                    <input
                                        type='checkbox'
                                        checked={event.signupOpen !== false}
                                        onChange={(e) => updateEvent(index, { signupOpen: e.target.checked })}
                                    />
                                    Lista aberta (aceitar inscrições)
                                </label>
                                <input
                                    className='field md:col-span-2'
                                    value={event.signupClosedMessage || ''}
                                    onChange={(e) => updateEvent(index, { signupClosedMessage: e.target.value })}
                                    placeholder='Mensagem quando a lista estiver encerrada (opcional)'
                                />
                                <textarea
                                    className='field md:col-span-2'
                                    rows={4}
                                    value={event.description}
                                    onChange={(e) => updateEvent(index, { description: e.target.value })}
                                    placeholder='Descrição'
                                />
                                <textarea
                                    className='field md:col-span-2'
                                    rows={4}
                                    value={event.highlights.join('\n')}
                                    onChange={(e) =>
                                        updateEvent(index, {
                                            highlights: e.target.value
                                                .split('\n')
                                                .map((l) => l.trim())
                                                .filter((l) => l.length > 0),
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
                                                .map((l) => l.trim())
                                                .filter((l) => l.length > 0),
                                        })
                                    }
                                    placeholder='Regras da lista (1 por linha)'
                                />
                            </div>

                            <div className='mt-4 flex justify-end'>
                                <button
                                    type='button'
                                    className='btn-secondary hover:!border-rose-400/60 hover:!text-rose-300'
                                    onClick={() => removeEvent(index)}
                                >
                                    Remover Evento
                                </button>
                            </div>
                        </details>
                    ))}
                </div>
            </section>

            {/* Confirm Dialog */}
            {confirm && (
                <AdminConfirmDialog
                    title={confirm.title}
                    message={confirm.message}
                    confirmLabel='Remover'
                    onConfirm={confirm.onConfirm}
                    onCancel={() => setConfirm(null)}
                />
            )}
        </div>
    );
};
