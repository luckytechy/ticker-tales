import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Stories } from './collections/Stories'
import { IPOWatch } from './collections/IPOWatch'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const plugins = process.env.BLOB_READ_WRITE_TOKEN
  ? [
      vercelBlobStorage({
        token: process.env.BLOB_READ_WRITE_TOKEN,
        collections: {
          media: true,
        },
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(__dirname),
    },
    meta: {
      titleSuffix: ' — Ticker Tales Admin',
      favicon: '/favicon.ico',
    },
  },
  collections: [Users, Stories, IPOWatch, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  plugins,
  sharp,
})
