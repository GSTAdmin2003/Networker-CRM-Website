import sanitizeHtml from 'sanitize-html'

const ALLOWED: sanitizeHtml.IOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'br', 'span'],
  allowedAttributes: {},
  disallowedTagsMode: 'discard',
}

export function sanitize(dirty: string): string {
  return sanitizeHtml(dirty, ALLOWED)
}
