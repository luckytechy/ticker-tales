import { NotFoundPage } from '@payloadcms/next/views'
import { importMap } from '@/app/(payload)/admin/importMap'
import config from '@payload-config'

const NotFound = () => NotFoundPage({ config, importMap })
export default NotFound
