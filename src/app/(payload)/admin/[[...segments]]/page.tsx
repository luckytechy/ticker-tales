import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '@/app/(payload)/admin/importMap'
import config from '@payload-config'
import { Metadata } from 'next'

type Args = {
  params: { segments: string[] }
  searchParams: { [key: string]: string | string[] }
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params: { segments: params.segments }, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params: { segments: params.segments }, searchParams, importMap })

export default Page
