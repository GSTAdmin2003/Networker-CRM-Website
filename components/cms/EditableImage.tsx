'use client'
import { useRef, useState } from 'react'
import { useCMS } from './CMSContext'
import Image from 'next/image'

interface Props {
  slot: string
  src: string | null
  alt: string
  fallback: React.ReactNode
}

export function EditableImage({ slot, src, alt, fallback }: Props) {
  const { editMode, uploadImage } = useCMS()
  const inputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState<string | null>(src)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setUploadError(null)
    try {
      const newUrl = await uploadImage(slot, file)
      setUrl(newUrl)
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (!editMode) {
    if (!url) return <>{fallback}</>
    return <Image src={url} alt={alt} fill style={{ objectFit: 'cover' }} />
  }

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
      }}
    >
      {url
        ? <Image src={url} alt={alt} fill style={{ objectFit: 'cover' }} />
        : fallback}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'rgba(0,0,0,0.35)',
        color: 'white', fontSize: 13, fontWeight: 500, flexDirection: 'column', gap: 4,
      }}>
        {uploading ? 'Uploading…' : uploadError ? uploadError : 'Click or drag to replace'}
      </div>
      <input
        ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
