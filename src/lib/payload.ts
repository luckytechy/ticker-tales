import configPromise from '@payload-config'
import { getPayload as _getPayload } from 'payload'

let cached: Awaited<ReturnType<typeof _getPayload>> | null = null

export async function getPayload() {
  if (cached) return cached
  cached = await _getPayload({ config: configPromise })
  return cached
}

export type StoryDoc = {
  id: string; title: string; slug: string; excerpt: string;
  companyName: string; companyTicker: string;
  category: 'company-story' | 'founder-journey' | 'hidden-gem';
  status: 'draft' | 'published' | 'scheduled';
  publishDate: string | null; featured: boolean; linkedinPublished: boolean;
  content: unknown;
  coverImage: { url: string; alt: string; sizes?: Record<string, { url: string }> } | null;
  ogImage: { url: string } | null;
  seoTitle: string | null; seoDescription: string | null;
  createdAt: string; updatedAt: string;
}

export type IPODoc = {
  id: string; companyName: string; slug: string;
  ipoOpenDate: string; ipoCloseDate: string;
  priceBand: string; issueSize: string; summary: unknown; verdict: string;
  status: 'upcoming' | 'open' | 'closed' | 'listed';
  coverImage: { url: string; alt: string } | null;
  seoTitle: string | null; seoDescription: string | null;
  createdAt: string; updatedAt: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  'company-story': 'Company Story', 'founder-journey': 'Founder Journey', 'hidden-gem': 'Hidden Gem',
}

export const IPO_STATUS_LABELS: Record<string, string> = {
  upcoming: 'Upcoming', open: 'Open Now', closed: 'Closed', listed: 'Listed',
}
