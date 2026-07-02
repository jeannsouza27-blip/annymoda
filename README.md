# Anny Moda Executiva

E-commerce premium para moda executiva feminina. Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + Prisma (PostgreSQL) + NextAuth v5 + Mercado Pago.

## Stack

- **Next.js 15** (App Router, Server Actions, Server Components)
- **TypeScript** + **Tailwind CSS v4** + **shadcn/ui** (tema dourado/off-white/preto/bege, dark mode via `next-themes`)
- **Prisma ORM** + **PostgreSQL** (Neon ou Supabase recomendados)
- **NextAuth v5** (Credentials, sessão JWT, papéis ADMIN/CUSTOMER)
- **Mercado Pago** (Checkout Pro — Pix e cartão)
- **Zustand** (carrinho persistente), **React Hook Form + Zod** (formulários), **Recharts** (dashboard admin), **Resend** (e-mail transacional)

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env` (um `.env` de desenvolvimento já existe com um `AUTH_SECRET` gerado, mas **sem banco de dados conectado**). Preencha:

- `DATABASE_URL` / `DIRECT_URL` — crie um banco Postgres gratuito em [neon.tech](https://neon.tech) ou [supabase.com](https://supabase.com) e cole as connection strings (pooled em `DATABASE_URL`, direta/non-pooled em `DIRECT_URL`).
- Demais variáveis (Mercado Pago, Resend, Instagram, WhatsApp) são opcionais para rodar localmente — o app degrada graciosamente sem elas (ver seção "Integrações" abaixo).

### 3. Criar as tabelas e popular dados de exemplo

```bash
npm run db:migrate   # cria as tabelas no banco (prisma migrate dev)
npm run db:seed      # popula categorias, produtos, banners, cupom, frete e usuários de teste
```

Ao final do seed, o terminal imprime as credenciais de teste:

- **Admin:** `admin@annymoda.com.br` / `AnnyAdmin@2026`
- **Cliente:** `cliente@exemplo.com.br` / `Cliente@2026`

### 4. Rodar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). O painel administrativo fica em `/admin` (login em `/entrar` com a conta admin acima).

## Scripts úteis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Aplica migrations do Prisma |
| `npm run db:seed` | Popula o banco com dados de exemplo |
| `npm run db:studio` | Abre o Prisma Studio (GUI do banco) |

## Integrações externas — checklist antes de ir para produção

O projeto foi construído para funcionar **sem** essas credenciais em desenvolvimento (com comportamento de fallback seguro), mas elas são necessárias antes do lançamento:

- [ ] **`DATABASE_URL` / `DIRECT_URL`** — banco Postgres de produção (Neon/Supabase).
- [ ] **`AUTH_SECRET`** — gere um novo valor para produção com `npx auth secret` (não reutilize o do `.env` de desenvolvimento).
- [ ] **`MERCADOPAGO_ACCESS_TOKEN` / `MERCADOPAGO_PUBLIC_KEY`** — crie uma aplicação em [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers). Sem essa variável, o checkout cria o pedido normalmente mas pula a etapa de pagamento online (fica como "aguardando confirmação manual") — ideal para testar o fluxo de compra sem uma conta Mercado Pago ainda.
- [ ] **`RESEND_API_KEY` / `EMAIL_FROM`** — necessário para o e-mail de recuperação de senha ser realmente enviado. Sem ele, o link de redefinição é apenas impresso no console do servidor (fluxo continua 100% testável).
- [ ] **`NEXT_PUBLIC_WHATSAPP_NUMBER`** — número real do WhatsApp Business (formato E.164 sem "+", ex: `5511999999999`).
- [ ] **`INSTAGRAM_GRAPH_ACCESS_TOKEN` / `NEXT_PUBLIC_INSTAGRAM_USER_ID`** — sem essas variáveis, a seção de Instagram da home exibe uma grade estática de exemplo.
- [ ] **Fotografia real dos produtos** — o seed usa imagens de placeholder (`picsum.photos`); substitua pelas fotos reais via upload no painel admin.
- [ ] **Endereço físico e redes sociais reais** — atualizar `src/lib/constants.ts` (`siteConfig`).
- [ ] **Armazenamento de imagens em produção** — uploads de produto são salvos em `public/uploads/products/` via `src/lib/upload.ts`. Isso funciona bem em VPS/servidor próprio, mas **não é durável em hosts serverless** (Vercel, etc. têm filesystem efêmero). Se for hospedar em serverless, troque a implementação de `src/lib/upload.ts` por S3, Cloudinary ou Vercel Blob — é o único arquivo que precisa mudar.

## Deploy no EasyPanel (VPS própria)

O projeto já inclui `Dockerfile`, `docker-entrypoint.sh` e `.dockerignore` prontos (build multi-stage do Next.js em modo `standalone`, aplica `prisma migrate deploy` automaticamente a cada start do container).

### 1. Banco de dados

**Recomendado:** continue usando o mesmo Neon já configurado em desenvolvimento — é só apontar a produção para a mesma `DATABASE_URL`/`DIRECT_URL`. Você não precisa gerenciar backups/atualizações de um Postgres na própria VPS, e os dados (produtos, admin, pedidos) já estarão lá.

**Alternativa:** criar um serviço Postgres dentro do próprio EasyPanel (template de 1 clique). Nesse caso o banco fica novo/vazio — depois do primeiro deploy (que já roda as migrations sozinho) você precisa popular com `npm run db:seed` **a partir da sua máquina local**, apontando temporariamente o `DATABASE_URL` do `.env` local para a connection string do Postgres do EasyPanel (a imagem de produção não inclui o `tsx`/dados de seed, então essa etapa é feita de fora, uma única vez).

### 2. Subir o código para o GitHub

```bash
git init
git add .
git commit -m "Primeira versão do site Anny Moda Executiva"
git branch -M main
git remote add origin <url-do-seu-repositorio-no-github>
git push -u origin main
```

### 3. Criar o App no EasyPanel

1. **New Project → App.**
2. **Source:** GitHub → selecione o repositório.
3. **Build method:** Dockerfile (o EasyPanel detecta o `Dockerfile` da raiz automaticamente).
4. **Build Args** (Settings → Build): defina aqui as variáveis `NEXT_PUBLIC_*`, pois o Next.js grava esses valores no código do navegador durante o build, não em runtime:
   - `NEXT_PUBLIC_SITE_URL` = `https://seudominio.com.br`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` = `5527997618290`
   - `NEXT_PUBLIC_INSTAGRAM_USER_ID` = (se for usar a API do Instagram)
5. **Environment Variables** (runtime — todas as demais do `.env.example`): `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` (gere um **novo** valor de produção, não reuse o do `.env` local), `AUTH_URL` (mesma URL do domínio), `MERCADOPAGO_ACCESS_TOKEN`/`MERCADOPAGO_PUBLIC_KEY`, `RESEND_API_KEY`/`EMAIL_FROM`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `INSTAGRAM_GRAPH_ACCESS_TOKEN`.
6. **Volume persistente:** monte um volume em `/app/public/uploads` — é onde ficam as imagens de produto enviadas pelo painel admin. Sem isso, elas somem a cada novo deploy.
7. **Domínio/HTTPS:** configure seu domínio na aba de domínios do App; o EasyPanel emite o certificado SSL automaticamente.
8. **Deploy.** O container já aplica as migrations pendentes e sobe o servidor sozinho (`docker-entrypoint.sh`).

### 4. Depois do primeiro deploy

- Acesse `https://seudominio.com.br/entrar` com o login admin do seed (`admin@annymoda.com.br` / `AnnyAdmin@2026`) e **troque a senha** (ainda não há uma tela de "alterar senha" própria para o admin além da recuperação por e-mail — use `/esqueci-minha-senha` com o e-mail do admin para gerar uma nova).
- Confira o checklist de integrações externas acima (Mercado Pago, Resend, WhatsApp, Instagram) antes de divulgar o site.

## Arquitetura

```
prisma/schema.prisma   Modelos de dados (Prisma)
prisma/seed.ts         Dados de exemplo

src/
  app/
    (storefront)/       Loja pública (home, categorias, produto, carrinho, checkout...)
    (auth)/              Login, cadastro, recuperação de senha
    (account)/           Área do cliente (pedidos, favoritos, endereços)
    (admin)/             Painel administrativo (protegido, role=ADMIN)
    api/                 Rotas HTTP (NextAuth, webhook Mercado Pago, upload de imagens)
  actions/               Server Actions (mutações — a camada que os formulários chamam)
  services/               Camada que encapsula todo acesso ao Prisma (repositório)
  components/            ui/ (shadcn) · storefront/ · admin/ · account/ · auth/ · shared/
  lib/                    prisma, auth, mercadopago, email, upload, format, constants...
  middleware.ts           Proteção de rotas /admin e /minha-conta
```

A camada `services/` é a única que fala com o Prisma diretamente; `actions/` valida (Zod) e autoriza (`requireUser`/`requireAdmin`) antes de chamar os services; as páginas (Server Components) chamam os services para leitura e os componentes cliente chamam as actions para escrita.
