# CLAUDE.md - Operacao do Projeto DJ Ana Jones

## Objetivo
Este projeto publica o site oficial da DJ Ana Jones com:
- galeria de fotos
- players (SoundCloud, Spotify, YouTube)
- pagina de eventos com lista de convidados
- formulario de contratacao
- painel admin para visualizar inscritos e pedidos

## Dominio oficial
- `https://anajonesdj.com`
- `https://www.anajonesdj.com` (redireciona para dominio principal)

## Onde esta hospedado
- Aplicacao: Netlify (`anajonesdj`)
- DNS: Cloudflare (zona `anajonesdj.com`)
- Persistencia dos formularios: AWS S3

## Arquivos importantes
- `/Users/brunosouza/Development/site-dj-ana-jones/.env`
- `/Users/brunosouza/Development/site-dj-ana-jones/.env.local`
- `/Users/brunosouza/Development/site-dj-ana-jones/docs/DEPLOY_CLOUDFLARE_AWS.md`

## Deploy (comando unico)
No diretorio do projeto:
```bash
set -a; source .env; set +a
npx netlify deploy --prod --build
```

## Validacao rapida apos deploy
1. Abrir `https://anajonesdj.com`
2. Testar evento em `/eventos/aniversario-ana-jones-2026`
3. Testar formulario de contratacao na home
4. Abrir `/admin`, inserir `ADMIN_DASHBOARD_KEY` e confirmar dados

## Variaveis obrigatorias no .env
Obrigatorias para funcionamento completo:
- `ADMIN_DASHBOARD_KEY`
- `DJ_AWS_REGION`
- `DJ_AWS_ACCESS_KEY_ID`
- `DJ_AWS_SECRET_ACCESS_KEY`
- `DJ_AWS_S3_BUCKET`
- `APP_DATA_PREFIX`

Publicas:
- `NEXT_PUBLIC_INSTAGRAM_PROFILE_URL`
- `NEXT_PUBLIC_SOUNDCLOUD_PROFILE_URL`
- `NEXT_PUBLIC_SPOTIFY_PROFILE_URL`
- `NEXT_PUBLIC_YOUTUBE_CHANNEL_URL`
- `NEXT_PUBLIC_SOUNDCLOUD_EMBED_URL`
- `NEXT_PUBLIC_SPOTIFY_EMBED_URL`
- `NEXT_PUBLIC_SPOTIFY_PLAYLIST_AUTORAIS_EMBED_URL`
- `NEXT_PUBLIC_SPOTIFY_PLAYLIST_SONZEIRA_EMBED_URL`
- `NEXT_PUBLIC_YOUTUBE_EMBED_URL`

Opcionais (email e instagram API):
- `INSTAGRAM_ACCESS_TOKEN`
- `EVENT_SIGNUP_NOTIFY_EMAIL`
- `BOOKING_NOTIFY_EMAIL`
- `SES_FROM_EMAIL` ou `DJ_SES_FROM_EMAIL`

## Persistencia dos dados
Os formulários sao salvos em:
- `s3://$DJ_AWS_S3_BUCKET/dj-ana-jones/event-signups.json`
- `s3://$DJ_AWS_S3_BUCKET/dj-ana-jones/booking-requests.json`

## Observacao SES
Se o SES nao tiver identidade verificada, os formularios continuam funcionando,
mas notificacao por email ficara desabilitada.
