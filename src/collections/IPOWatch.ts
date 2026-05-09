import type { CollectionConfig } from 'payload'

export const IPOWatch: CollectionConfig = {
  slug: 'ipo-watch',
  access: { read: () => true },
  admin: {
    useAsTitle: 'companyName',
    defaultColumns: ['companyName', 'status', 'ipoOpenDate', 'ipoCloseDate'],
    description: 'IPO listings with plain-English breakdowns and verdicts.',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && data.companyName && !data.slug) {
          data.slug = data.companyName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'companyName', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { position: 'sidebar' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'ipoOpenDate', type: 'date', required: true, admin: { width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'MMM d, yyyy' } } },
        { name: 'ipoCloseDate', type: 'date', required: true, admin: { width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'MMM d, yyyy' } } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'priceBand', type: 'text', required: true, admin: { width: '50%', description: 'e.g. ₹440 – ₹462' } },
        { name: 'issueSize', type: 'text', required: true, admin: { width: '50%', description: 'e.g. ₹3,200 Cr' } },
      ],
    },
    { name: 'summary', type: 'richText', required: true },
    { name: 'verdict', type: 'text', required: true, admin: { description: 'One-line take.' } },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'upcoming',
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Open Now', value: 'open' },
        { label: 'Closed', value: 'closed' },
        { label: 'Listed', value: 'listed' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'seoTitle', type: 'text' },
    { name: 'seoDescription', type: 'textarea' },
  ],
}
