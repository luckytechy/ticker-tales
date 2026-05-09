import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.LINKEDIN_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json({ error: 'LINKEDIN_WEBHOOK_URL is not configured.' }, { status: 503 })
  }

  let body: { title: string; excerpt: string; slug: string; coverImageUrl: string | null }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const { title, excerpt, slug, coverImageUrl } = body
  if (!title || !slug) {
    return NextResponse.json({ error: 'title and slug are required.' }, { status: 400 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const outgoing = { title, excerpt, url: `${siteUrl}/stories/${slug}`, coverImageUrl: coverImageUrl ?? null }

  let webhookRes: Response
  try {
    webhookRes = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(outgoing) })
  } catch (err) {
    console.error('[notify-linkedin] fetch error:', err)
    return NextResponse.json({ error: 'Failed to reach webhook URL.' }, { status: 502 })
  }

  if (!webhookRes.ok) {
    console.error('[notify-linkedin] webhook returned', webhookRes.status)
    return NextResponse.json({ error: `Webhook responded with ${webhookRes.status}.` }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
