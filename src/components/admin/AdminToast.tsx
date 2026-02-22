'use client';

import { useCallback, useEffect, useState } from 'react';

export type ToastKind = 'success' | 'error' | 'info';

type Toast = {
    id: number;
    message: string;
    kind: ToastKind;
};

let nextId = 1;
let globalPush: ((message: string, kind: ToastKind) => void) | null = null;

export const showToast = (message: string, kind: ToastKind = 'info') => {
    globalPush?.(message, kind);
};

const COLORS: Record<ToastKind, string> = {
    success: 'border-emerald-400/60 bg-emerald-950/80 text-emerald-200',
    error: 'border-rose-400/60 bg-rose-950/80 text-rose-200',
    info: 'border-cyan-400/60 bg-cyan-950/80 text-cyan-200',
};

export const AdminToast = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const push = useCallback((message: string, kind: ToastKind) => {
        const id = nextId++;
        setToasts((prev) => [...prev, { id, message, kind }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    useEffect(() => {
        globalPush = push;
        return () => {
            globalPush = null;
        };
    }, [push]);

    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className='fixed bottom-5 right-5 z-[999] flex flex-col gap-2'>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`animate-slide-in rounded-xl border px-5 py-3 text-sm font-medium shadow-lg backdrop-blur-md ${COLORS[toast.kind]}`}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
};
