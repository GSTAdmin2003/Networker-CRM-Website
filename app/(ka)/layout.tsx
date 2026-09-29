import { RootShell } from '@/app/root-shell'
import { siteMetadata, siteViewport } from '@/lib/site'

export const metadata = siteMetadata
export const viewport = siteViewport

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="ka">{children}</RootShell>
}
