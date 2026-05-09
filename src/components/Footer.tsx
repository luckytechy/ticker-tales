import { NewsletterSignup } from './NewsletterSignup'

export function Footer() {
  return (
    <footer className="bg-navy text-slate-400 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <span className="text-amber text-xl font-black tracking-tight">Ticker Tales</span>
            <p className="mt-3 text-sm leading-relaxed">Indian stock market stories for curious investors. No jargon, no noise — just the context behind the companies.</p>
          </div>
          <div>
            <p className="text-white text-sm font-semibold mb-3">Explore</p>
            <ul className="space-y-2 text-sm">
              <li><a href="/stories" className="hover:text-amber transition-colors">Stories</a></li>
              <li><a href="/ipo-watch" className="hover:text-amber transition-colors">IPO Watch</a></li>
              <li><a href="/about" className="hover:text-amber transition-colors">About</a></li>
            </ul>
          </div>
          <div>
            <p className="text-white text-sm font-semibold mb-3">Stay in the loop</p>
            <NewsletterSignup />
          </div>
        </div>
        <div className="border-t border-navy-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Ticker Tales. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
