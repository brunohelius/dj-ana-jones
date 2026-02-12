# Deploy - DJ Ana Jones (Cloudflare + AWS)

## 1) Preparar ambiente
No projeto:
```bash
npm install
npm run build
```

## 2) Subir no GitHub
Repositorio criado:
- https://github.com/brunohelius/dj-ana-jones

## 3) Deploy no Cloudflare Pages (recomendado)
1. Cloudflare Dashboard -> Pages -> Create project
2. Connect to Git
3. Selecionar repo `brunohelius/dj-ana-jones`
4. Build settings:
- Framework preset: Next.js
- Build command: `npm run build`
- Build output directory: `.next`
5. Configurar variaveis de ambiente (copiar de `.env.local` e completar os campos faltantes)

## 4) DNS do dominio
No Cloudflare DNS da zona do dominio `anajonesdj`:
- Criar/ajustar `CNAME` do host (ex.: `www`) para o target do Pages
- Opcional: redirecionar raiz (`@`) para `www` via Rules
- SSL/TLS: Full (strict)

## 5) Variaveis obrigatorias em producao
- `ADMIN_DASHBOARD_KEY`
- `EVENT_SIGNUP_NOTIFY_EMAIL`
- `BOOKING_NOTIFY_EMAIL`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SES_FROM_EMAIL`

## 6) AWS SES
1. Verificar dominio/remetente no SES
2. Sair do sandbox ou verificar destinatarios
3. Garantir permissao `ses:SendEmail` para a chave usada

## 7) Checklist de validacao
- Home carregando com galeria e embeds
- Formulario de evento salva no backend
- Formulario de contratacao salva no backend
- `/admin` responde com chave valida
- Emails chegando para inscricoes e contratacoes
