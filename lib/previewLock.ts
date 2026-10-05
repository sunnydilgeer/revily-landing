/*
 * Password lock for /preview while it's under construction. The password comes from PREVIEW_PASSWORD
 * (set it in Vercel), falling back to a default. The unlock cookie holds a hash of the password, so changing
 * the password locks everyone out again. Runs in middleware (edge) and the unlock route (node).
 */
export const PREVIEW_COOKIE = 'revily_preview'
export const PREVIEW_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

export function previewPassword() {
  return process.env.PREVIEW_PASSWORD || 'pythagoras'
}

/** The cookie value for a password: a SHA-256 hash, never the password itself. */
export async function previewToken(password: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`revily-preview:${password}`))
  return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('')
}

/** Answers are forgiving about case and spaces: "Pythagoras ", "PYTHAGORAS". */
export const normalisePassword = (value: string) => value.trim().toLowerCase()
