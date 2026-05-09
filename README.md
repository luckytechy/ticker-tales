# Ticker Tales

Indian stock market stories for curious investors. Built with Next.js 14, Payload CMS 3.0, Supabase, and Tailwind CSS.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, SSG + ISR) |
| CMS | Payload CMS 3.0 (embedded) |
| Database | Supabase (PostgreSQL) |
| Styling | Tailwind CSS |
| Deployment | Vercel |

## Quick Start

```bash
npm install
cp .env.example .env.local  # fill in your values
npm run seed                 # create admin user
npm run generate:types
npm run generate:importmap
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Supabase PostgreSQL connection string |
| `PAYLOAD_SECRET` | Yes | Random secret (min 32 chars) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public URL of the site |
| `LINKEDIN_WEBHOOK_URL` | No | Webhook for LinkedIn notify button |
| `BLOB_READ_WRITE_TOKEN` | Prod | Vercel Blob token for media uploads |

## Vercel Deployment

1. Push this repo to GitHub
2. Import into Vercel, set all env vars above
3. Use Supabase **Transaction Pooler** URL (port 6543) for `DATABASE_URL`
4. Create a Vercel Blob store and add `BLOB_READ_WRITE_TOKEN`
5. Deploy — Payload auto-migrates the database on first boot
