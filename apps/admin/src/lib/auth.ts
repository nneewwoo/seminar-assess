import { db } from '@seminar-assess/db'
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase
} from '@oslojs/encoding'
import { sha256 } from '@oslojs/crypto/sha2'
import type { RequestEvent } from '@sveltejs/kit'
import type { User, Session } from '@seminar-assess/db'

export const generateSessionToken = (): string => {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  const token = encodeBase32LowerCaseNoPadding(bytes)
  return token
}

export const createSession = async (
  token: string,
  userId: string
): Promise<Session> => {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
  }
  await db.session.create({
    data: session
  })
  return session
}

export const validateSessionToken = async (
  token: string
): Promise<SessionValidationResult> => {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const result = await db.session.findUnique({
    where: {
      id: sessionId
    },
    include: {
      user: true
    }
  })
  if (result === null) {
    return { session: null, user: null }
  }
  const { user, ...session } = result
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.session.delete({ where: { id: sessionId } })
    return { session: null, user: null }
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    await db.session.update({
      where: {
        id: session.id
      },
      data: {
        expiresAt: session.expiresAt
      }
    })
  }
  return { session, user }
}

export const invalidateSession = async (sessionId: string): Promise<void> => {
  await db.session.delete({ where: { id: sessionId } })
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null }

export const setSessionTokenCookie = (
  event: RequestEvent,
  token: string,
  expiresAt: Date
): void => {
  event.cookies.set('session', token, {
    httpOnly: true,
    sameSite: 'lax',
    expires: expiresAt,
    path: '/'
  })
}

export const deleteSessionTokenCookie = (event: RequestEvent): void => {
  event.cookies.set('session', '', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })
}
