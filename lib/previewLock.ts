/*
 * Password lock for /preview while it's under construction. The password comes from PREVIEW_PASSWORD
 * (set it in Vercel), falling back to a default that only lives here as its hash (Sunny changed it on 11 Oct). The
 * unlock cookie holds the same hash, so changing the password locks everyone out again. Runs in middleware (edge)
 * and the unlock route (node).
 */
export const PREVIEW_COOKIE = 'revily_preview'
export const PREVIEW_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

const DEFAULT_TOKEN = '5ef5f4079dec06827fe2658d8a87191c1006eaed49a97f7cdc856a4ac3218bce'

/** The cookie value for a password: a SHA-256 hash, never the password itself. */
export async function previewToken(password: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`revily-preview:${password}`))
  return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('')
}

/** The cookie value that unlocks /preview. */
export async function expectedToken() {
  const password = process.env.PREVIEW_PASSWORD
  return password ? previewToken(normalisePassword(password)) : DEFAULT_TOKEN
}

/** Answers are forgiving about case and spaces. */
export const normalisePassword = (value: string) => value.trim().toLowerCase()
