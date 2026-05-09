'use client'

import React, { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export function NotifyLinkedInButton() {
  const { savedDocumentData } = useDocumentInfo()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleNotify() {
    if (!savedDocumentData?.slug) { alert('Save the story first before notifying LinkedIn.'); return }
    setStatus('loading')
    try {
      const res = await fetch('/api/notify-linkedin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: savedDocumentData.title, excerpt: savedDocumentData.excerpt, slug: savedDocumentData.slug, coverImageUrl: (savedDocumentData.coverImage as any)?.url ?? null }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  return (
    <div style={{ marginTop: '12px' }}>
      <button type="button" onClick={handleNotify} disabled={status === 'loading'}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#0077B5', color: '#fff', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600, opacity: status === 'loading' ? 0.7 : 1, width: '100%', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
        {status === 'loading' ? 'Notifying…' : 'Notify LinkedIn'}
      </button>
      {status === 'success' && <p style={{ color: '#16a34a', fontSize: '12px', marginTop: '6px', textAlign: 'center' }}>Webhook triggered successfully.</p>}
      {status === 'error' && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px', textAlign: 'center' }}>Webhook failed — check LINKEDIN_WEBHOOK_URL env var.</p>}
    </div>
  )
}

export default NotifyLinkedInButton
