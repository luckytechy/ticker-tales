import Image from 'next/image'
import Link from 'next/link'
import { calculateReadTime, truncate } from '@/lib/utils'
import { CATEGORY_LABELS, type StoryDoc } from '@/lib/payload'

const CATEGORY_COLORS: Record<string, string> = {
  'company-story': 'bg-blue-100 text-blue-800',
  'founder-journey': 'bg-purple-100 text-purple-800',
  'hidden-gem': 'bg-amber/10 text-amber-dark',
}

export function StoryCard({ story, priority = false }: { story: StoryDoc; priority?: boolean }) {
  const readTime = calculateReadTime(story.content)
  return (
    <Link href={`/stories/${story.slug}`} className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-amber/40 hover:shadow-lg transition-all duration-200">
      <div className="relative aspect-[3/2] overflow-hidden bg-slate-100">
        {story.coverImage?.url ? (
          <Image src={story.coverImage.sizes?.card?.url ?? story.coverImage.url} alt={story.coverImage.alt ?? story.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" priority={priority} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy flex items-center justify-center">
            <span className="text-amber text-3xl font-black">{story.companyTicker}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[story.category] ?? 'bg-slate-100 text-slate-600'}`}>{CATEGORY_LABELS[story.category] ?? story.category}</span>
          <span className="text-xs font-mono text-slate-400">{story.companyTicker}</span>
        </div>
        <h3 className="text-navy font-bold text-lg leading-snug mb-2 group-hover:text-amber-dark transition-colors line-clamp-2">{story.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-3">{truncate(story.excerpt, 140)}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium text-navy-600">{story.companyName}</span>
          <span>{readTime} min read</span>
        </div>
      </div>
    </Link>
  )
}
