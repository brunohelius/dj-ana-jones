'use client';

import { useState } from 'react';

type StatusState = {
  kind: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
};

const initialStatus: StatusState = {
  kind: 'idle',
};

export const BookingForm = () => {
  const [status, setStatus] = useState<StatusState>(initialStatus);

  const handleSubmit = async (formData: FormData) => {
    setStatus({ kind: 'loading' });

    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      eventType: String(formData.get('eventType') || '').trim(),
      eventDate: String(formData.get('eventDate') || '').trim(),
      city: String(formData.get('city') || '').trim(),
      message: String(formData.get('message') || '').trim(),
    };

    try {
      const response = await fetch('/api/booking-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as {
        message?: string;
      };

      if (!response.ok) {
        setStatus({
          kind: 'error',
          message:
            body.message || 'Nao foi possivel enviar o pedido de contratacao.',
        });
        return;
      }

      setStatus({
        kind: 'success',
        message:
          body.message ||
          'Pedido enviado. Em breve voce recebera retorno para fechar a data.',
      });
    } catch {
      setStatus({
        kind: 'error',
        message: 'Erro de conexao. Tente novamente em instantes.',
      });
    }
  };

  return (
    <div className='glass-card p-6 md:p-8'>
      <h3 className='text-xl font-display uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
        Contratacao
      </h3>
      <p className='mt-3 text-sm text-[var(--muted)]'>
        Solicite orçamento para clubs, eventos corporativos, festas privadas e festivais.
      </p>

      <form
        className='mt-6 grid gap-4'
        action={async (formData) => {
          await handleSubmit(formData);
        }}
      >
        <input className='field' name='name' placeholder='Nome *' required />
        <div className='grid gap-4 md:grid-cols-2'>
          <input className='field' name='email' type='email' placeholder='Email' />
          <input className='field' name='phone' placeholder='WhatsApp' />
        </div>
        <div className='grid gap-4 md:grid-cols-2'>
          <input className='field' name='eventType' placeholder='Tipo de evento *' required />
          <input className='field' name='eventDate' type='date' />
        </div>
        <input className='field' name='city' placeholder='Cidade' />
        <textarea
          className='field min-h-28 resize-y'
          name='message'
          placeholder='Descreva seu evento, expectativa de publico, estrutura e briefing artistico'
        />

        <button className='btn-primary mt-2' type='submit' disabled={status.kind === 'loading'}>
          {status.kind === 'loading' ? 'Enviando...' : 'Solicitar Orçamento'}
        </button>

        {status.kind !== 'idle' && (
          <p
            className={`text-sm ${
              status.kind === 'success' ? 'text-emerald-300' : 'text-rose-300'
            }`}
          >
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
};
