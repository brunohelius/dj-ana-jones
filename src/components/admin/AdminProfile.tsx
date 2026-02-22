'use client';

import { useCallback, useState } from 'react';

import { showToast } from './AdminToast';

type SiteProfile = {
    heroSubtitle: string;
    heroBio: string;
    aboutTitle: string;
    aboutParagraph1: string;
    aboutParagraph2: string;
    base: string;
    projeto: string;
    formato: string;
    booking: string;
};

type SiteSocialLinks = {
    instagram: string;
    soundcloud: string;
    spotify: string;
    youtube: string;
};

type SiteMediaEmbed = {
    title: string;
    description: string;
    iframe: string;
};

type SiteContactInfo = {
    email: string;
    whatsapp: string;
    whatsappLabel: string;
    bookingDescription: string;
};

type ProfileContent = {
    profile: SiteProfile;
    socialLinks: SiteSocialLinks;
    mediaEmbeds: SiteMediaEmbed[];
    contactInfo: SiteContactInfo;
    updatedAt: string;
    // keep the rest to not lose data on save
    [key: string]: unknown;
};

type Props = {
    fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
};

export const AdminProfile = ({ fetchWithAuth }: Props) => {
    const [data, setData] = useState<ProfileContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);

        try {
            const response = await fetchWithAuth('/api/site-content');

            if (!response.ok) {
                showToast('Falha ao carregar perfil.', 'error');
                return;
            }

            const body = (await response.json()) as { data: ProfileContent };
            setData(body.data);
            showToast('Perfil carregado.', 'success');
        } catch {
            showToast('Erro ao conectar.', 'error');
        } finally {
            setLoading(false);
        }
    }, [fetchWithAuth]);

    const saveData = async () => {
        if (!data) return;

        setSaving(true);

        try {
            const response = await fetchWithAuth('/api/site-content', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                showToast('Falha ao salvar.', 'error');
                return;
            }

            const body = (await response.json()) as { data: ProfileContent };
            setData(body.data);
            showToast('Perfil salvo com sucesso!', 'success');
        } catch {
            showToast('Erro ao salvar.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const updateProfile = (patch: Partial<SiteProfile>) => {
        setData((prev) => {
            if (!prev) return prev;
            return { ...prev, profile: { ...prev.profile, ...patch } };
        });
    };

    const updateSocial = (patch: Partial<SiteSocialLinks>) => {
        setData((prev) => {
            if (!prev) return prev;
            return { ...prev, socialLinks: { ...prev.socialLinks, ...patch } };
        });
    };

    const updateEmbed = (index: number, patch: Partial<SiteMediaEmbed>) => {
        setData((prev) => {
            if (!prev) return prev;
            const next = [...prev.mediaEmbeds];
            next[index] = { ...next[index], ...patch };
            return { ...prev, mediaEmbeds: next };
        });
    };

    const addEmbed = () => {
        setData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                mediaEmbeds: [...prev.mediaEmbeds, { title: '', description: '', iframe: '' }],
            };
        });
    };

    const removeEmbed = (index: number) => {
        setData((prev) => {
            if (!prev) return prev;
            return { ...prev, mediaEmbeds: prev.mediaEmbeds.filter((_, i) => i !== index) };
        });
    };

    const updateContact = (patch: Partial<SiteContactInfo>) => {
        setData((prev) => {
            if (!prev) return prev;
            return { ...prev, contactInfo: { ...prev.contactInfo, ...patch } };
        });
    };

    // Not loaded
    if (!data) {
        return (
            <div className='glass-card p-6'>
                <h3 className='font-display text-xl uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                    Perfil e Configurações
                </h3>
                <p className='mt-2 text-sm text-[var(--muted)]'>
                    Edite bio, redes sociais, players de mídia e informações de contato.
                </p>
                <button
                    type='button'
                    className='btn-primary mt-5'
                    onClick={loadData}
                    disabled={loading}
                >
                    {loading ? 'Carregando...' : 'Carregar Perfil'}
                </button>
            </div>
        );
    }

    const { profile, socialLinks, mediaEmbeds, contactInfo } = data;

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <h3 className='font-display text-xl uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                        Perfil e Configurações
                    </h3>
                    {data.updatedAt && (
                        <p className='mt-1 text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>
                            Última atualização: {new Date(data.updatedAt).toLocaleString('pt-BR')}
                        </p>
                    )}
                </div>
                <div className='flex gap-3'>
                    <button type='button' className='btn-secondary' onClick={loadData} disabled={loading}>
                        Recarregar
                    </button>
                    <button type='button' className='btn-primary' onClick={saveData} disabled={saving}>
                        {saving ? 'Salvando...' : 'Salvar Perfil'}
                    </button>
                </div>
            </div>

            {/* Bio / Hero */}
            <section className='rounded-2xl border border-white/15 bg-white/5 p-5'>
                <h4 className='font-display text-lg uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                    Texto da Home
                </h4>
                <p className='mt-1 text-sm text-[var(--muted)]'>Subtítulo do hero e bio exibida na primeira dobra.</p>
                <div className='mt-4 space-y-3'>
                    <input
                        className='field'
                        value={profile.heroSubtitle}
                        onChange={(e) => updateProfile({ heroSubtitle: e.target.value })}
                        placeholder='Subtítulo (ex: Brasilia • Fundadora Clubinho Room)'
                    />
                    <textarea
                        className='field'
                        rows={3}
                        value={profile.heroBio}
                        onChange={(e) => updateProfile({ heroBio: e.target.value })}
                        placeholder='Bio da home (parágrafo principal)'
                    />
                </div>
            </section>

            {/* Sobre */}
            <section className='rounded-2xl border border-white/15 bg-white/5 p-5'>
                <h4 className='font-display text-lg uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                    Seção Sobre
                </h4>
                <p className='mt-1 text-sm text-[var(--muted)]'>Título e parágrafos da seção "Sobre".</p>
                <div className='mt-4 space-y-3'>
                    <input
                        className='field'
                        value={profile.aboutTitle}
                        onChange={(e) => updateProfile({ aboutTitle: e.target.value })}
                        placeholder='Título da seção (ex: Identidade artística)'
                    />
                    <textarea
                        className='field'
                        rows={4}
                        value={profile.aboutParagraph1}
                        onChange={(e) => updateProfile({ aboutParagraph1: e.target.value })}
                        placeholder='Primeiro parágrafo'
                    />
                    <textarea
                        className='field'
                        rows={3}
                        value={profile.aboutParagraph2}
                        onChange={(e) => updateProfile({ aboutParagraph2: e.target.value })}
                        placeholder='Segundo parágrafo'
                    />
                </div>
            </section>

            {/* Info cards */}
            <section className='rounded-2xl border border-white/15 bg-white/5 p-5'>
                <h4 className='font-display text-lg uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                    Cards Informativo
                </h4>
                <p className='mt-1 text-sm text-[var(--muted)]'>Base, projeto, formato e booking exibidos na seção Sobre.</p>
                <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                    <input
                        className='field'
                        value={profile.base}
                        onChange={(e) => updateProfile({ base: e.target.value })}
                        placeholder='Base (ex: Brasilia - DF)'
                    />
                    <input
                        className='field'
                        value={profile.projeto}
                        onChange={(e) => updateProfile({ projeto: e.target.value })}
                        placeholder='Projeto (ex: Clubinho Room)'
                    />
                    <input
                        className='field'
                        value={profile.formato}
                        onChange={(e) => updateProfile({ formato: e.target.value })}
                        placeholder='Formato (ex: DJ Set / Live)'
                    />
                    <input
                        className='field'
                        value={profile.booking}
                        onChange={(e) => updateProfile({ booking: e.target.value })}
                        placeholder='Booking (ex: Brasil e Exterior)'
                    />
                </div>
            </section>

            {/* Social Links */}
            <section className='rounded-2xl border border-white/15 bg-white/5 p-5'>
                <h4 className='font-display text-lg uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                    Redes Sociais
                </h4>
                <p className='mt-1 text-sm text-[var(--muted)]'>URLs dos perfis de redes sociais.</p>
                <div className='mt-4 space-y-3'>
                    <div>
                        <label className='mb-1 block text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Instagram</label>
                        <input
                            className='field'
                            value={socialLinks.instagram}
                            onChange={(e) => updateSocial({ instagram: e.target.value })}
                            placeholder='https://instagram.com/anajonesdj'
                        />
                    </div>
                    <div>
                        <label className='mb-1 block text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>SoundCloud</label>
                        <input
                            className='field'
                            value={socialLinks.soundcloud}
                            onChange={(e) => updateSocial({ soundcloud: e.target.value })}
                            placeholder='https://soundcloud.com/...'
                        />
                    </div>
                    <div>
                        <label className='mb-1 block text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Spotify</label>
                        <input
                            className='field'
                            value={socialLinks.spotify}
                            onChange={(e) => updateSocial({ spotify: e.target.value })}
                            placeholder='https://open.spotify.com/artist/...'
                        />
                    </div>
                    <div>
                        <label className='mb-1 block text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>YouTube</label>
                        <input
                            className='field'
                            value={socialLinks.youtube}
                            onChange={(e) => updateSocial({ youtube: e.target.value })}
                            placeholder='https://youtube.com/...'
                        />
                    </div>
                </div>
            </section>

            {/* Media Embeds */}
            <section className='rounded-2xl border border-white/15 bg-white/5 p-5'>
                <div className='flex flex-col justify-between gap-3 md:flex-row md:items-center'>
                    <div>
                        <h4 className='font-display text-lg uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                            Players de Mídia
                        </h4>
                        <p className='mt-1 text-sm text-[var(--muted)]'>
                            SoundCloud, Spotify, YouTube e outros players embed — {mediaEmbeds.length} itens.
                        </p>
                    </div>
                    <button type='button' className='btn-secondary md:w-auto' onClick={addEmbed}>
                        + Adicionar Player
                    </button>
                </div>

                <div className='mt-4 space-y-3'>
                    {mediaEmbeds.map((embed, index) => (
                        <div
                            key={`embed-${index}`}
                            className='rounded-2xl border border-white/10 bg-black/10 p-4'
                        >
                            <div className='grid gap-3 md:grid-cols-[1fr_1fr_auto]'>
                                <input
                                    className='field'
                                    value={embed.title}
                                    onChange={(e) => updateEmbed(index, { title: e.target.value })}
                                    placeholder='Título (ex: SoundCloud)'
                                />
                                <input
                                    className='field'
                                    value={embed.description}
                                    onChange={(e) => updateEmbed(index, { description: e.target.value })}
                                    placeholder='Descrição curta'
                                />
                                <button
                                    type='button'
                                    className='btn-secondary hover:!border-rose-400/60 hover:!text-rose-300'
                                    onClick={() => removeEmbed(index)}
                                >
                                    ✕
                                </button>
                            </div>
                            <input
                                className='field mt-3'
                                value={embed.iframe}
                                onChange={(e) => updateEmbed(index, { iframe: e.target.value })}
                                placeholder='URL do iframe embed'
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Info */}
            <section className='rounded-2xl border border-white/15 bg-white/5 p-5'>
                <h4 className='font-display text-lg uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                    Informações de Contato
                </h4>
                <p className='mt-1 text-sm text-[var(--muted)]'>Email, WhatsApp e texto da seção de contratação.</p>
                <div className='mt-4 space-y-3'>
                    <div className='grid gap-3 sm:grid-cols-2'>
                        <div>
                            <label className='mb-1 block text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Email</label>
                            <input
                                className='field'
                                value={contactInfo.email}
                                onChange={(e) => updateContact({ email: e.target.value })}
                                placeholder='abreuanacrist@gmail.com'
                            />
                        </div>
                        <div>
                            <label className='mb-1 block text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>WhatsApp Label</label>
                            <input
                                className='field'
                                value={contactInfo.whatsappLabel}
                                onChange={(e) => updateContact({ whatsappLabel: e.target.value })}
                                placeholder='+55 61 99999-9999'
                            />
                        </div>
                    </div>
                    <div>
                        <label className='mb-1 block text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>WhatsApp Link</label>
                        <input
                            className='field'
                            value={contactInfo.whatsapp}
                            onChange={(e) => updateContact({ whatsapp: e.target.value })}
                            placeholder='https://wa.me/5561999999999'
                        />
                    </div>
                    <div>
                        <label className='mb-1 block text-xs uppercase tracking-[0.1em] text-[var(--muted)]'>Texto de Contratação</label>
                        <textarea
                            className='field'
                            rows={3}
                            value={contactInfo.bookingDescription}
                            onChange={(e) => updateContact({ bookingDescription: e.target.value })}
                            placeholder='Descrição exibida na seção de contratação'
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
