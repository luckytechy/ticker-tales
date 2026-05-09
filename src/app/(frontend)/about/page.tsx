import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Ticker Tales is a stock market storytelling platform for Indian investors.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-black text-navy mb-6">About Ticker Tales</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-xl text-slate-600 leading-relaxed mb-8">Indian stock market, explained for people who read.</p>
        <p>Ticker Tales started with a simple frustration: financial media in India is either too technical for regular investors or too shallow to be useful.</p>
        <p>Every story we publish asks: What does this company actually do? Who built it and why? What does the market price imply about its future?</p>
        <p>We cover Company Stories, Founder Journeys, and Hidden Gems.</p>
        <h2>IPO Watch</h2>
        <p>Every IPO that hits the Indian market gets a plain-English breakdown — who&apos;s selling and why, and our honest verdict in a single sentence.</p>
        <h2>No conflicts</h2>
        <p>We don&apos;t run ads. We don&apos;t take money from companies to write about them. Nothing on this site is investment advice.</p>
        <div className="bg-amber/5 border border-amber/20 rounded-xl p-6 mt-8">
          <p className="text-sm text-slate-600 font-medium"><strong className="text-navy">Disclaimer:</strong> Ticker Tales is a financial media publication, not a SEBI-registered advisor. Nothing published here constitutes investment advice.</p>
        </div>
      </div>
    </div>
  )
}
