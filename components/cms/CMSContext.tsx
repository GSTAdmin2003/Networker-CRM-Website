'use client'
import { createContext, useContext, useState, useCallback } from 'react'

type CMSState = {
  editMode: boolean
  saving: boolean
  error: string | null
  save: () => Promise<void>
  logout: () => Promise<void>
  uploadImage: (slot: string, file: File) => Promise<string>
}

export const CMSContext = createContext<CMSState>({
  editMode: false, saving: false, error: null,
  save: async () => {}, logout: async () => {}, uploadImage: async () => '',
})

export function useCMS() { return useContext(CMSContext) }

export function CMSContextProvider({ children }: { children: React.ReactNode }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const save = useCallback(async () => {
    setSaving(true)
    setError(null)
    try {
      const entries: Record<string, string> = {}
      document.querySelectorAll<HTMLElement>('[data-cms-key]').forEach((el) => {
        const key = el.getAttribute('data-cms-key')!
        entries[key] = el.innerHTML
      })
      const res = await fetch('/api/cms', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entries),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Save failed')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/cms/auth', { method: 'DELETE' })
    window.location.search = ''
  }, [])

  const uploadImage = useCallback(async (slot: string, file: File): Promise<string> => {
    const form = new FormData()
    form.append('file', file)
    form.append('slot', slot)
    const res = await fetch('/api/cms/upload', { method: 'POST', body: form })
    if (!res.ok) throw new Error((await res.json()).error ?? 'Upload failed')
    return (await res.json()).url as string
  }, [])

  return (
    <CMSContext.Provider value={{ editMode: true, saving, error, save, logout, uploadImage }}>
      {children}
    </CMSContext.Provider>
  )
}
