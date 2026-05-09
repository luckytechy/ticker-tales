import type { CollectionConfig } from 'payload'

export const Stories: CollectionConfig = {
  slug: 'stories',
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'companyName', 'status', 'publishDate', 'featured'],
    description: 'Long-form stock market stories and founder journeys.',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && data.title && !data.slug) {
          data.slug = data.title
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
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug', type: 'text', required: true, unique: true, index: true,
      admin: { description: 'Auto-generated from title. Edit carefully.', position: 'sidebar' },
    },
    { name: 'excerpt', type: 'textarea', required: true, admin: { description: '2-3 lines shown on listing page.' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'content', type: 'richText', required: true },
    {
      type: 'row',
      fields: [
        { name: 'companyName', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'companyTicker', type: 'text', required: true, admin: { width: '50%', description: 'e.g. TCS, INFY' } },
      ],
    },
    {
      name: 'category', type: 'select', required: true,
      options: [
        { label: 'Company Story', value: 'company-story' },
        { label: 'Founder Journey', value: 'founder-journey' },
        { label: 'Hidden Gem', value: 'hidden-gem' },
      ],
    },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Scheduled', value: 'scheduled' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishDate', type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime', displayFormat: 'MMM d, yyyy h:mm a' } },
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Show in homepage hero.' } },
    { name: 'linkedinPublished', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Check after LinkedIn post goes live.' } },
    {
      name: 'notifyLinkedinButton', type: 'ui',
      admin: { components: { Field: '@/components/payload/NotifyLinkedInButton#NotifyLinkedInButton' }, position: 'sidebar' },
    },
    { name: 'seoTitle', type: 'text', admin: { description: 'Defaults to story title if empty.' } },
    { name: 'seoDescription', type: 'textarea', admin: { description: 'Defaults to excerpt if empty.' } },
    { name: 'ogImage', type: 'upload', relationTo: 'media', admin: { description: 'Defaults to cover image if empty.' } },
  ],
}
