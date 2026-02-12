# Deploy - DJ Ana Jones (Netlify + Cloudflare DNS + AWS)

## 1) Stack de deploy usada
- Hosting/app runtime: Netlify (Next.js runtime)
- Dominio: Cloudflare DNS (`anajonesdj.com`)
- Persistencia de inscricoes/booking: AWS S3
- Email: AWS SES (opcional)

## 2) Pre-requisitos
No diretorio do projeto:
```bash
set -a; source .env; set +a
npm install
```

## 3) Deploy de aplicacao
```bash
npx netlify deploy --prod --build
```

Deploy de referencia em producao:
- `https://anajonesdj.com`

## 4) DNS no Cloudflare (ja aplicado)
Zona: `anajonesdj.com`

Registros principais:
- `CNAME @ -> anajonesdj.netlify.app` (DNS only)
- `CNAME www -> anajonesdj.netlify.app` (DNS only)

## 5) Variaveis obrigatorias em producao
Variaveis da aplicacao:
- `ADMIN_DASHBOARD_KEY`
- `DJ_AWS_REGION`
- `DJ_AWS_ACCESS_KEY_ID`
- `DJ_AWS_SECRET_ACCESS_KEY`
- `DJ_AWS_S3_BUCKET`
- `APP_DATA_PREFIX`

Variaveis de midia/publicas:
- `NEXT_PUBLIC_*` (links e embeds)

Variaveis opcionais:
- `INSTAGRAM_ACCESS_TOKEN`
- `EVENT_SIGNUP_NOTIFY_EMAIL`
- `BOOKING_NOTIFY_EMAIL`
- `SES_FROM_EMAIL` ou `DJ_SES_FROM_EMAIL`

## 6) Persistencia em AWS S3
Arquivos JSON persistidos no bucket:
- `dj-ana-jones/event-signups.json`
- `dj-ana-jones/booking-requests.json`

## 7) Testes de validacao (feitos)
- Home, galeria e secoes principais carregando
- SoundCloud, Spotify e YouTube embedando corretamente
- Inscricao em evento funcionando
- Pedido de contratacao funcionando
- Painel `/admin` exibindo dados com `ADMIN_DASHBOARD_KEY`
- APIs com 401 sem chave e 200 com chave

## 8) Pendencia de email (SES)
No momento nao ha identidade verificada no SES da conta.
Para habilitar envio real de email:
1. Verificar remetente ou dominio no SES
2. Definir `SES_FROM_EMAIL` (ou `DJ_SES_FROM_EMAIL`)
3. Definir `EVENT_SIGNUP_NOTIFY_EMAIL` e `BOOKING_NOTIFY_EMAIL`
