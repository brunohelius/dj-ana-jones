# Site DJ Ana Jones

Site oficial da DJ Ana Jones (Brasilia, fundadora da Clubinho Room), com foco em:
- agenda e pagina de eventos com link de lista
- captacao de interessados para evento
- secao de contratacao
- embeds de SoundCloud, Spotify e YouTube
- galeria e feed Instagram
- painel admin simples

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- AWS SES (notificacoes por email, opcional)

## Rotas principais
- `/` - Home
- `/eventos/[slug]` - Pagina de evento e lista
- `/admin` - Painel de inscritos e contratacao
- `/api/event-signups` - API de lista de evento
- `/api/booking-requests` - API de contratacao

## Executar local
```bash
npm install
npm run dev
```

## Producao
- Dominio principal: `https://anajonesdj.com`
- Dominio alternativo: `https://www.anajonesdj.com` (redireciona para principal)
- Hosting: Netlify

### Deploy
```bash
set -a; source .env; set +a
npx netlify deploy --prod --build
```

## Variaveis de ambiente
Use `.env.local` para ambiente local e `.env.example` como referencia.

Campos principais:
- `ADMIN_DASHBOARD_KEY`
- `DJ_AWS_REGION`
- `DJ_AWS_ACCESS_KEY_ID`
- `DJ_AWS_SECRET_ACCESS_KEY`
- `DJ_AWS_S3_BUCKET`
- `EVENT_SIGNUP_NOTIFY_EMAIL` (opcional)
- `BOOKING_NOTIFY_EMAIL` (opcional)
- `SES_FROM_EMAIL` ou `DJ_SES_FROM_EMAIL` (opcional)
- `INSTAGRAM_ACCESS_TOKEN` (opcional)

## Dados locais (MVP)
- `data/event-signups.json`
- `data/booking-requests.json`

## Documentacao
- Plano completo: `docs/PLANO_IMPLEMENTACAO.md`
- Fontes de imagem: `docs/IMAGE_SOURCES.md`
