import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

type EmailPayload = {
  subject: string;
  htmlBody: string;
  textBody: string;
  recipient: string;
};

type EmailResult = {
  sent: boolean;
  reason?: string;
};

const FALLBACK_RECIPIENT = 'abreuanacrist@gmail.com';
const FALLBACK_RESEND_FROM = 'Ana Jones <onboarding@resend.dev>';
const FALLBACK_SES_FROM = 'abreuanacrist@gmail.com';
const RESEND_API_URL = 'https://api.resend.com/emails';

const getResendConfig = () => {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  const fromAddress =
    process.env.RESEND_FROM_EMAIL ||
    process.env.DJ_SES_FROM_EMAIL ||
    process.env.SES_FROM_EMAIL ||
    FALLBACK_RESEND_FROM;

  return {
    apiKey,
    fromAddress,
  };
};

const getSesClient = () => {
  const region = process.env.DJ_AWS_REGION || process.env.AWS_REGION;
  const accessKeyId =
    process.env.DJ_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.DJ_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new SESClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
};

const sendViaResend = async (payload: EmailPayload): Promise<EmailResult> => {
  const config = getResendConfig();

  if (!config) {
    return { sent: false, reason: 'RESEND_API_KEY not configured' };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.fromAddress,
        to: [payload.recipient],
        subject: payload.subject,
        html: payload.htmlBody,
        text: payload.textBody,
      }),
    });

    if (!response.ok) {
      let reason = `Resend error ${response.status}`;

      try {
        const body = (await response.json()) as {
          message?: string;
          error?: {
            message?: string;
          };
        };

        reason = body.error?.message || body.message || reason;
      } catch {
        // keep fallback reason
      }

      return { sent: false, reason };
    }

    return { sent: true };
  } catch (error) {
    return {
      sent: false,
      reason: error instanceof Error ? error.message : 'Unknown Resend error',
    };
  }
};

const sendViaSes = async (payload: EmailPayload): Promise<EmailResult> => {
  const fromAddress =
    process.env.DJ_SES_FROM_EMAIL || process.env.SES_FROM_EMAIL || FALLBACK_SES_FROM;
  const client = getSesClient();

  if (!fromAddress) {
    return { sent: false, reason: 'SES_FROM_EMAIL not configured' };
  }

  if (!client) {
    return { sent: false, reason: 'AWS SES credentials not configured' };
  }

  try {
    await client.send(
      new SendEmailCommand({
        Destination: {
          ToAddresses: [payload.recipient],
        },
        Message: {
          Subject: {
            Charset: 'UTF-8',
            Data: payload.subject,
          },
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: payload.htmlBody,
            },
            Text: {
              Charset: 'UTF-8',
              Data: payload.textBody,
            },
          },
        },
        Source: fromAddress,
      }),
    );

    return { sent: true };
  } catch (error) {
    return {
      sent: false,
      reason: error instanceof Error ? error.message : 'Unknown SES error',
    };
  }
};

const sendEmail = async (payload: EmailPayload): Promise<EmailResult> => {
  const resendConfigured = Boolean(process.env.RESEND_API_KEY?.trim());

  if (resendConfigured) {
    const resendResult = await sendViaResend(payload);

    if (resendResult.sent) {
      return resendResult;
    }

    const sesClient = getSesClient();

    if (!sesClient) {
      return resendResult;
    }

    const sesResult = await sendViaSes(payload);

    if (sesResult.sent) {
      return sesResult;
    }

    return {
      sent: false,
      reason: `Resend: ${resendResult.reason || 'Unknown Resend error'} | SES fallback: ${
        sesResult.reason || 'Unknown SES error'
      }`,
    };
  }

  return sendViaSes(payload);
};

type EventNotificationInput = {
  eventTitle: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  guestCount: number;
  notes?: string;
  createdAt: string;
};

export const sendEventSignupNotification = async (
  input: EventNotificationInput,
): Promise<EmailResult> => {
  const recipient = process.env.EVENT_SIGNUP_NOTIFY_EMAIL || FALLBACK_RECIPIENT;

  if (!recipient) {
    return {
      sent: false,
      reason: 'EVENT_SIGNUP_NOTIFY_EMAIL not configured',
    };
  }

  return sendEmail({
    recipient,
    subject: `Nova inscricao na lista - ${input.eventTitle}`,
    htmlBody: `
      <h2>Nova inscricao recebida</h2>
      <p><strong>Evento:</strong> ${input.eventTitle}</p>
      <p><strong>Nome:</strong> ${input.name}</p>
      <p><strong>Email:</strong> ${input.email || 'Nao informado'}</p>
      <p><strong>Telefone:</strong> ${input.phone || 'Nao informado'}</p>
      <p><strong>Cidade:</strong> ${input.city || 'Nao informada'}</p>
      <p><strong>Acompanhantes:</strong> ${input.guestCount}</p>
      <p><strong>Mensagem:</strong> ${input.notes || 'Sem mensagem'}</p>
      <p><strong>Enviado em:</strong> ${input.createdAt}</p>
    `,
    textBody: `Nova inscricao recebida\n\nEvento: ${input.eventTitle}\nNome: ${input.name}\nEmail: ${input.email || 'Nao informado'}\nTelefone: ${input.phone || 'Nao informado'}\nCidade: ${input.city || 'Nao informada'}\nAcompanhantes: ${input.guestCount}\nMensagem: ${input.notes || 'Sem mensagem'}\nEnviado em: ${input.createdAt}`,
  });
};

type BookingNotificationInput = {
  name: string;
  email?: string;
  phone?: string;
  eventType: string;
  eventDate?: string;
  city?: string;
  message?: string;
  createdAt: string;
};

export const sendBookingNotification = async (
  input: BookingNotificationInput,
): Promise<EmailResult> => {
  const recipient = process.env.BOOKING_NOTIFY_EMAIL || FALLBACK_RECIPIENT;

  if (!recipient) {
    return {
      sent: false,
      reason: 'BOOKING_NOTIFY_EMAIL not configured',
    };
  }

  return sendEmail({
    recipient,
    subject: `Novo pedido de contratacao - ${input.name}`,
    htmlBody: `
      <h2>Novo pedido de contratacao</h2>
      <p><strong>Nome:</strong> ${input.name}</p>
      <p><strong>Email:</strong> ${input.email || 'Nao informado'}</p>
      <p><strong>Telefone:</strong> ${input.phone || 'Nao informado'}</p>
      <p><strong>Tipo de evento:</strong> ${input.eventType}</p>
      <p><strong>Data prevista:</strong> ${input.eventDate || 'Nao informada'}</p>
      <p><strong>Cidade:</strong> ${input.city || 'Nao informada'}</p>
      <p><strong>Briefing:</strong> ${input.message || 'Sem briefing'}</p>
      <p><strong>Enviado em:</strong> ${input.createdAt}</p>
    `,
    textBody: `Novo pedido de contratacao\n\nNome: ${input.name}\nEmail: ${input.email || 'Nao informado'}\nTelefone: ${input.phone || 'Nao informado'}\nTipo de evento: ${input.eventType}\nData prevista: ${input.eventDate || 'Nao informada'}\nCidade: ${input.city || 'Nao informada'}\nBriefing: ${input.message || 'Sem briefing'}\nEnviado em: ${input.createdAt}`,
  });
};
