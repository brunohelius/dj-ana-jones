import { NextRequest, NextResponse } from 'next/server';

import { createBookingRequest, listBookingRequests } from '@/lib/bookingRequests';
import { sendBookingNotification } from '@/lib/email';

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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      eventType?: string;
      eventDate?: string;
      city?: string;
      message?: string;
    };

    const name = normalizeText(body.name);
    const email = normalizeText(body.email);
    const phone = normalizeText(body.phone);
    const eventType = normalizeText(body.eventType);
    const eventDate = normalizeText(body.eventDate);
    const city = normalizeText(body.city);
    const message = normalizeText(body.message);

    if (name.length < 3) {
      return NextResponse.json(
        { message: 'Informe um nome valido para contato.' },
        { status: 400 },
      );
    }

    if (eventType.length < 3) {
      return NextResponse.json(
        { message: 'Informe o tipo do evento para contratacao.' },
        { status: 400 },
      );
    }

    const booking = await createBookingRequest({
      name,
      email: email || undefined,
      phone: phone || undefined,
      eventType,
      eventDate: eventDate || undefined,
      city: city || undefined,
      message: message || undefined,
    });

    const emailResult = await sendBookingNotification({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      eventType: booking.eventType,
      eventDate: booking.eventDate,
      city: booking.city,
      message: booking.message,
      createdAt: booking.createdAt,
    });

    return NextResponse.json({
      message: 'Pedido de contratacao enviado com sucesso.',
      data: booking,
      notification: emailResult,
    });
  } catch {
    return NextResponse.json(
      { message: 'Erro inesperado ao salvar pedido de contratacao.' },
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

  const bookings = await listBookingRequests();

  return NextResponse.json({ data: bookings });
}
