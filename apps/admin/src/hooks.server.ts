import {
  deleteSessionTokenCookie,
  setSessionTokenCookie,
  validateSessionToken
} from '$lib/auth'
import { Keys } from '$lib/constants'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(Keys.SESSION_TOKEN) ?? null

  if (token === null) {
    event.locals.user = null
    event.locals.session = null

    return await resolve(event)
  }

  const { session, user } = await validateSessionToken(token)
  if (session !== null) {
    setSessionTokenCookie(event, token, session.expiresAt)
  } else {
    deleteSessionTokenCookie(event)
  }

  event.locals.user = user
  event.locals.session = session

  return await resolve(event)
}
