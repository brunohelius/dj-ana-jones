# Plano de implementacao - Site DJ Ana Jones

Data de consolidacao: 12 de fevereiro de 2026

## 1) Objetivo do projeto
Criar o site oficial da DJ Ana Jones com:
- identidade visual premium da cena eletronica
- galeria com fotos/imagens reais da artista
- embeds de SoundCloud, Spotify e YouTube
- secao de eventos com link individual para lista de convidados
- secao de contratacao para pedidos de show
- painel admin simples para consultar inscritos/interessados
- notificacao por email (AWS SES) para novos cadastros

## 2) Referencias analisadas (DJs internacionais)

### 2.1 Martin Garrix
Link: https://martingarrix.com/
Pontos observados:
- Hero de alto impacto com CTA claro (ouvir / ingressos)
- Navegacao por pilares (tour, music, shop, contact)
- Forte prova social com agenda, releases e videos em destaque
Aplicacao no projeto Ana Jones:
- Hero com CTA para agenda e contratacao
- Blocos organizados: Sobre, Midia, Galeria, Eventos, Contratacao
- Cards de eventos com acesso direto para lista

### 2.2 Charlotte de Witte
Link: https://charlottedewittemusic.com/
Pontos observados:
- Site objetivo e orientado a conversao profissional
- Informacoes de booking/management em alta prioridade
- Direcao visual minimalista e consistente
Aplicacao no projeto Ana Jones:
- Secao de contratacao com formulario direto
- Email/WhatsApp de booking em destaque
- Estrutura clara para contratantes e produtores

### 2.3 David Guetta
Link: https://davidguetta.com/
Pontos observados:
- Agenda centrada em tour dates com integracao externa
- Fluxo pratico para RSVP/tickets
- Menu com discografia, fotos, videos e agenda
Aplicacao no projeto Ana Jones:
- Estrutura de eventos com pagina dedicada por evento
- Fluxo de lista de convidados por link compartilhavel
- Arquitetura preparada para evoluir para venda/ingresso

## 3) Direcao visual (cores e linguagem)
Paleta definida:
- Fundo principal: `#090B14`
- Laranja assinatura: `#FF6B35`
- Ciano contraste: `#33E1ED`
- Creme texto principal: `#FFF6DF`
- Texto secundario: `#BAC4DE`

Tipografia:
- Display: `Bebas Neue`
- Corpo: `Space Grotesk`

Conceito:
- atmosfera noturna eletronic club
- glassmorphism leve em cards
- gradientes e brilhos para identidade memoravel

## 4) Arquitetura do site

### Home
- Hero principal
- Sobre artista
- Midia (players SoundCloud/Spotify/YouTube)
- Galeria
- Instagram (feed via API ou fallback)
- Eventos
- Contratacao

### Evento individual
Rota: `/eventos/[slug]`
- detalhes do evento
- regras da lista
- formulario de inscricao (nome, contato, acompanhantes)

### Admin
Rota: `/admin`
- protegido por chave (`ADMIN_DASHBOARD_KEY`)
- lista de inscritos por evento
- lista de pedidos de contratacao

### APIs
- `POST/GET /api/event-signups`
- `POST/GET /api/booking-requests`

Persistencia inicial:
- arquivos JSON em `data/`

## 5) Funcionalidades implementadas
- site completo em Next.js (App Router + TypeScript)
- formulario de lista de evento funcionando
- formulario de contratacao funcionando
- painel admin com consulta de cadastros
- notificacao por email via AWS SES (configuravel)
- fallback Instagram pronto e feed real habilitavel por token
- galeria atualizada com imagens reais pesquisadas da artista

## 6) Fluxo de evento (aniversario / lista)
1. Ana cria/ativa evento em `src/lib/events.ts`
2. Compartilha link: `https://dominio/eventos/aniversario-ana-jones-2026`
3. Convidado preenche formulario
4. Sistema salva inscricao em `data/event-signups.json`
5. Sistema envia email para operacao (quando SES configurado)
6. Ana consulta lista no painel `/admin`

## 7) Infra e deploy
Dominio alvo informado: `anajonesdj` (Cloudflare)

Credenciais e variaveis:
- `.env.local` foi preparado com chaves disponiveis localmente (Cloudflare/AWS) e placeholders necessarios
- template de producao em `.env.example`

Itens para deploy:
- publicar app Next.js (Vercel, ECS, EC2, ou outro)
- apontar DNS no Cloudflare para host final
- configurar HTTPS
- configurar variaveis de ambiente em producao

## 8) Melhorias fase 2
- upload de fotos/eventos por painel administrativo real (DB)
- autenticacao admin com login (nao apenas chave)
- export CSV da lista de convidados
- webhook WhatsApp/Telegram para novos inscritos
- pixel e analytics (Meta/GA4/PostHog)
- integração com venda de ingressos

## 9) Riscos e mitigacao
- Dependencia de fontes externas de imagem: manter creditos e backup local
- Persistencia em JSON (MVP): migrar para banco em producao
- Chave admin simples: migrar para auth robusta em fase 2
