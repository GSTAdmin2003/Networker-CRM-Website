'use client'
import { useRef, useEffect, createElement } from 'react'
import { useCMS } from './CMSContext'

interface Props {
  cmsKey: string
  html: string
  as?: keyof React.JSX.IntrinsicElements
  className?: string
}

export function EditableText({ cmsKey, html, as: Tag = 'span', className }: Props) {
  const { editMode } = useCMS()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = html
  }, [html])

  if (!editMode) {
    return createElement(Tag as keyof React.JSX.IntrinsicElements, { className, dangerouslySetInnerHTML: { __html: html } })
  }

  return createElement(Tag as keyof React.JSX.IntrinsicElements, {
    ref,
    'data-cms-key': cmsKey,
    className,
    contentEditable: true,
    suppressContentEditableWarning: true,
    style: { outline: '2px dashed rgba(13,148,136,0.4)', borderRadius: 2 },
  })
}
