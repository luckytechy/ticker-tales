import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-navy text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-amber text-2xl font-black tracking-tight group-hover:opacity-90 transition-opacity">Ticker Tales</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/stories" className="text-slate-300 hover:text-amber transition-colors">Stories</Link>
          <Link href="/ipo-watch" className="text-slate-300 hover:text-amber transition-colors">IPO Watch</Link>
          <Link href="/about" className="text-slate-300 hover:text-amber transition-colors">About</Link>
        </nav>
      </div>
    </header>
  )
}
