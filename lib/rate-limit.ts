const map = new Map<string, { count: number; reset: number }>()

export function rateLimit(ip: string, limit = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const entry = map.get(ip)
  if (!entry || now > entry.reset) {
    map.set(ip, { count: 1, reset: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}
