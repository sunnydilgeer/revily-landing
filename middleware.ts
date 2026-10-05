import { NextResponse, type NextRequest } from 'next/server'
import { PREVIEW_COOKIE, normalisePassword, previewPassword, previewToken } from './lib/previewLock'

// /preview is locked while it's under construction: without the unlock cookie, show the splash page instead
// (the address stays the same, so unlocking is just a reload).
export async function middleware(request: NextRequest) {
  const expected = await previewToken(normalisePassword(previewPassword()))
  if (request.cookies.get(PREVIEW_COOKIE)?.value === expected) return NextResponse.next()
  const response = NextResponse.rewrite(new URL('/preview-locked', request.url))
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('X-Robots-Tag', 'noindex')
  return response
}

export const config = { matcher: ['/preview', '/preview/:path*'] }
