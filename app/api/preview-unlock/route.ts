import { NextResponse } from 'next/server'
import { PREVIEW_COOKIE, PREVIEW_COOKIE_MAX_AGE, expectedToken, normalisePassword, previewToken } from '../../../lib/previewLock'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { password?: unknown }
  const guess = typeof body.password === 'string' ? normalisePassword(body.password) : ''
  const expected = await expectedToken()
  // A short pause makes guessing slow without bothering anyone who knows it.
  await new Promise(resolve => setTimeout(resolve, 400))
  if (!guess || await previewToken(guess) !== expected) return NextResponse.json({ ok: false }, { status: 401 })
  const response = NextResponse.json({ ok: true })
  response.cookies.set(PREVIEW_COOKIE, expected, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: PREVIEW_COOKIE_MAX_AGE,
  })
  return response
}
