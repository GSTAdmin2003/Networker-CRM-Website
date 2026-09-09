import { createElement } from 'react'

interface Props {
  cmsKey?: string
  html: string
  as?: keyof React.JSX.IntrinsicElements
  className?: string
}

// Plain static rendering -- the CMS edit-mode branch this component used to
// have was removed (no admin editing on this site anymore). `cmsKey` is kept
// as an accepted-but-unused prop so every call site across the landing
// sections needs no changes.
export function EditableText({ html, as: Tag = 'span', className }: Props) {
  return createElement(Tag as keyof React.JSX.IntrinsicElements, {
    className,
    dangerouslySetInnerHTML: { __html: html },
  })
}
