import { NextRequest, NextResponse } from 'next/server';

import { getSiteContent, saveSiteContent } from '@/lib/siteContent';

const getAdminKey = (request: NextRequest) => {
  return (
    request.headers.get('x-admin-key') ||
    request.nextUrl.searchParams.get('adminKey') ||
    ''
  );
};

const requireAdmin = (request: NextRequest) => {
  const configuredAdminKey = process.env.ADMIN_DASHBOARD_KEY;

  if (!configuredAdminKey) {
    return NextResponse.json(
      { message: 'ADMIN_DASHBOARD_KEY nao configurada no ambiente.' },
      { status: 500 },
    );
  }

  const adminKey = getAdminKey(request);

  if (adminKey !== configuredAdminKey) {
    return NextResponse.json({ message: 'Nao autorizado.' }, { status: 401 });
  }

  return null;
};

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  const content = await getSiteContent();
  return NextResponse.json({ data: content });
}

export async function PUT(request: NextRequest) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  try {
    const body = (await request.json()) as unknown;
    const content = await saveSiteContent(body);

    return NextResponse.json({
      message: 'Conteudo atualizado com sucesso.',
      data: content,
    });
  } catch {
    return NextResponse.json(
      { message: 'Falha ao atualizar o conteudo do site.' },
      { status: 500 },
    );
  }
}

