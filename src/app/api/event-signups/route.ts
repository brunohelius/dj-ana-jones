import { NextRequest, NextResponse } from 'next/server';

import { getEventBySlug } from '@/lib/events';
import { sendEventSignupNotification } from '@/lib/email';
import { createEventSignup, listEventSignups } from '@/lib/signups';

const getAdminKey = (request: NextRequest) => {
  return (
    request.headers.get('x-admin-key') ||
    request.nextUrl.searchParams.get('adminKey') ||
    ''
  );
};

const normalizeText = (value: unknown) => {
  return typeof value === 'string' ? value.trim() : '';
};

const normalizeGuestCount = (value: unknown) => {
  const parsed = Number(value);

  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }

  return Math.min(parsed, 2);
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      eventSlug?: string;
      name?: string;
      email?: string;
      phone?: string;
      city?: string;
      guestCount?: number;
      notes?: string;
    };

    const eventSlug = normalizeText(body.eventSlug);
    const name = normalizeText(body.name);
    const email = normalizeText(body.email);
    const phone = normalizeText(body.phone);
    const city = normalizeText(body.city);
    const notes = normalizeText(body.notes);
    const guestCount = normalizeGuestCount(body.guestCount);

    if (!eventSlug) {
      return NextResponse.json(
        { message: 'Evento nao informado.' },
        { status: 400 },
      );
    }

    if (name.length < 3) {
      return NextResponse.json(
        { message: 'Informe um nome completo valido.' },
        { status: 400 },
      );
    }

    const event = getEventBySlug(eventSlug);

    if (!event) {
      return NextResponse.json(
        { message: 'Evento nao encontrado.' },
        { status: 404 },
      );
    }

    const signup = await createEventSignup({
      eventSlug,
      name,
      email: email || undefined,
      phone: phone || undefined,
      city: city || undefined,
      guestCount,
      notes: notes || undefined,
    });

    const emailResult = await sendEventSignupNotification({
      eventTitle: event.title,
      name: signup.name,
      email: signup.email,
      phone: signup.phone,
      city: signup.city,
      guestCount: signup.guestCount,
      notes: signup.notes,
      createdAt: signup.createdAt,
    });

    return NextResponse.json({
      message: 'Inscricao realizada com sucesso.',
      data: signup,
      notification: emailResult,
    });
  } catch {
    return NextResponse.json(
      { message: 'Falha inesperada ao salvar inscricao.' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const configuredAdminKey = process.env.ADMIN_DASHBOARD_KEY;

  if (!configuredAdminKey) {
    return NextResponse.json(
      { message: 'ADMIN_DASHBOARD_KEY nao configurada no ambiente.' },
      { status: 500 },
    );
  }

  const adminKey = getAdminKey(request);

  if (adminKey !== configuredAdminKey) {
    return NextResponse.json(
      { message: 'Nao autorizado.' },
      { status: 401 },
    );
  }

  const eventSlug = request.nextUrl.searchParams.get('eventSlug') || undefined;
  const format = request.nextUrl.searchParams.get('format');
  const signups = await listEventSignups(eventSlug);

  if (format === 'csv') {
    const header = [
      'createdAt',
      'eventSlug',
      'eventTitle',
      'name',
      'email',
      'phone',
      'city',
      'guestCount',
      'notes',
    ];

    const toCsvCell = (value: unknown) => {
      const safeValue = value === undefined || value === null ? '' : String(value);

      return `"${safeValue.replace(/"/g, '""')}"`;
    };

    const rows = signups.map((signup) => {
      const event = getEventBySlug(signup.eventSlug);
      return [
        signup.createdAt,
        signup.eventSlug,
        event?.title || '',
        signup.name,
        signup.email || '',
        signup.phone || '',
        signup.city || '',
        signup.guestCount,
        signup.notes || '',
      ]
        .map(toCsvCell)
        .join(',');
    });

    const eventLabel =
      eventSlug && eventSlug.length > 0 ? eventSlug : 'todos-eventos';
    const fileName = `${eventLabel}-inscricoes.csv`;
    const csv = [header.join(','), ...rows].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  }

  return NextResponse.json({ data: signups });
}
