'use client';

import { useState } from 'react';

type EventSignupFormProps = {
  eventSlug: string;
  eventTitle: string;
};

type StatusState = {
  kind: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
};

const initialStatus: StatusState = {
  kind: 'idle',
};

export const EventSignupForm = ({
  eventSlug,
  eventTitle,
}: EventSignupFormProps) => {
  const [status, setStatus] = useState<StatusState>(initialStatus);

  const handleSubmit = async (formData: FormData) => {
    setStatus({ kind: 'loading' });

    const payload = {
      eventSlug,
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      city: String(formData.get('city') || '').trim(),
      guestCount: Number(formData.get('guestCount') || 0),
      notes: String(formData.get('notes') || '').trim(),
    };

    try {
      const response = await fetch('/api/event-signups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as {
        message?: string;
        notification?: {
          sent?: boolean;
          reason?: string;
        };
      };

      if (!response.ok) {
        setStatus({
          kind: 'error',
          message: body.message || 'Nao foi possivel enviar sua inscricao.',
        });
        return;
      }

      setStatus({
        kind: 'success',
        message: buildSuccessMessage({
          defaultMessage:
            body.message ||
            `Inscricao confirmada para ${eventTitle}. Te esperamos na pista.`,
          notification: body.notification,
        }),
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
      <h2 className='text-2xl font-display uppercase tracking-[0.08em] text-[var(--brand-cream)]'>
        Entrar na Lista
      </h2>
      <p className='mt-3 text-sm text-[var(--muted)]'>
        Preencha os dados para garantir seu nome na lista deste evento.
      </p>

      <form
        className='mt-6 grid gap-4'
        action={async (formData) => {
          await handleSubmit(formData);
        }}
      >
        <input
          className='field'
          name='name'
          placeholder='Nome completo *'
          required
        />
        <div className='grid gap-4 md:grid-cols-2'>
          <input className='field' name='email' type='email' placeholder='Email' />
          <input className='field' name='phone' placeholder='WhatsApp' />
        </div>
        <div className='grid gap-4 md:grid-cols-2'>
          <input className='field' name='city' placeholder='Cidade' />
          <input
            className='field'
            name='guestCount'
            type='number'
            min={0}
            max={2}
            defaultValue={0}
            placeholder='Qtd. acompanhantes (0-2)'
          />
        </div>
        <textarea
          className='field min-h-28 resize-y'
          name='notes'
          placeholder='Mensagem opcional'
        />

        <button className='btn-primary mt-2' type='submit' disabled={status.kind === 'loading'}>
          {status.kind === 'loading' ? 'Enviando...' : 'Confirmar Inscricao'}
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

const buildSuccessMessage = ({
  defaultMessage,
  notification,
}: {
  defaultMessage: string;
  notification?: {
    sent?: boolean;
    reason?: string;
  };
}) => {
  if (!notification) {
    return `${defaultMessage} Registro gravado na lista de contatos do evento.`;
  }

  if (notification.sent) {
    return `${defaultMessage} Notificacao enviada para a equipe da Ana Jones.`;
  }

  return `${defaultMessage} Registro gravado na lista de contatos. Notificacao por e-mail pendente: ${
    notification.reason || 'destinatario nao configurado.'
  }`;
};
