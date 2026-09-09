import Image from 'next/image'

interface Props {
  slot?: string
  src: string | null
  alt: string
  fallback: React.ReactNode
}

// Plain static rendering -- the CMS edit-mode branch (click/drag to
// replace, upload API) was removed (no admin editing on this site
// anymore). `slot` is kept as an accepted-but-unused prop so every call
// site across the landing sections needs no changes.
export function EditableImage({ src, alt, fallback }: Props) {
  if (!src) return <>{fallback}</>
  return <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} />
}
