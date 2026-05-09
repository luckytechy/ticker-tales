import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function seed() {
  console.log('Seeding Ticker Tales...')
  const payload = await getPayload({ config })
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@tickertales.in'
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!'
  const name = process.env.SEED_ADMIN_NAME ?? 'Ticker Tales Admin'
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (existing.totalDocs > 0) {
    console.log(`Admin user already exists: ${email}`)
  } else {
    await payload.create({ collection: 'users', data: { email, password, name } })
    console.log(`Admin user created: ${email} / ${password}`)
    console.log('Change this password immediately in production.')
  }
  console.log('Seed complete. Admin panel: ' + (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000') + '/admin')
  process.exit(0)
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1) })
