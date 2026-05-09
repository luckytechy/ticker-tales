export function calculateReadTime(content: unknown): number {
  const text = extractTextFromLexical(content)
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function extractTextFromLexical(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as Record<string, unknown>
  if (n.type === 'text' && typeof n.text === 'string') return n.text
  const children = Array.isArray(n.children) ? n.children : n.root ? [n.root] : []
  return (children as unknown[]).map(extractTextFromLexical).join(' ')
}

export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr))
}

export function formatDateRange(open: string | Date, close: string | Date): string {
  return `${formatDate(open)} – ${formatDate(close)}`
}

export function truncate(str: string, maxLength = 120): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).replace(/\s+\S*$/, '') + '…'
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}
