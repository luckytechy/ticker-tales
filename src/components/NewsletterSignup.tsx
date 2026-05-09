'use client'

import { useState } from 'react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  if (status === 'success') return <p className="text-sm text-amber font-medium">You&apos;re in. Watch your inbox.</p>

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="bg-navy-800 text-white placeholder-slate-500 border border-navy-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-amber" />
      <button type="submit" disabled={status === 'loading'} className="bg-amber text-navy font-semibold text-sm px-4 py-2 rounded hover:bg-amber-dark transition-colors disabled:opacity-60">{status === 'loading' ? 'Subscribing…' : 'Subscribe'}</button>
      {status === 'error' && <p className="text-red-400 text-xs">Something went wrong. Try again.</p>}
    </form>
  )
}
