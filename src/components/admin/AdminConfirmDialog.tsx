'use client';

type Props = {
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export const AdminConfirmDialog = ({
    title,
    message,
    confirmLabel = 'Confirmar',
    onConfirm,
    onCancel,
}: Props) => {
    return (
        <div className='fixed inset-0 z-[900] flex items-center justify-center'>
            <div
                className='absolute inset-0 bg-black/70 backdrop-blur-sm'
                onClick={onCancel}
            />
            <div className='relative z-10 mx-4 w-full max-w-md rounded-2xl border border-white/15 bg-[rgba(13,18,35,0.95)] p-6 shadow-2xl backdrop-blur-xl'>
                <h3 className='font-display text-xl uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
                    {title}
                </h3>
                <p className='mt-3 text-sm leading-relaxed text-[var(--muted)]'>
                    {message}
                </p>
                <div className='mt-6 flex justify-end gap-3'>
                    <button type='button' className='btn-secondary' onClick={onCancel}>
                        Cancelar
                    </button>
                    <button
                        type='button'
                        className='btn-primary'
                        onClick={() => {
                            onConfirm();
                            onCancel();
                        }}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
