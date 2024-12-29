import { sha1 } from '@oslojs/crypto/sha1'
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase
} from '@oslojs/encoding'

import { users, sessions } from '@seminar-assess/db/schema'
import { eq } from '@seminar-assess/db/drizzle'
import { db, type NewSession } from '@seminar-assess/db'

const DAY_IN_MS = 1000 * 60 * 60 * 24

const uuid = (token: string) => {
  const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(token)))
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    '4'.concat(hash.slice(13, 16)),
    ((Number.parseInt(hash[16], 16) & 0x3) | 0x8)
      .toString(16)
      .concat(hash.slice(17, 20)),
    hash.slice(20, 32)
  ].join('-')
}

const generateSessionToken = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  const token = encodeBase32LowerCaseNoPadding(bytes)
  return token
}

const createSession = async (token: string, userId: string) => {
  const sessionId = uuid(token)
  const session: NewSession = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 30 * DAY_IN_MS)
  }

  await db.insert(sessions).values(session)

  return session
}

const validateSessionToken = async (token: string) => {
  const sessionId = uuid(token)
  const result = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    with: { user: true }
  })

  if (result) {
    const { user, ...session } = result

    if (Date.now() >= session.expiresAt.getTime()) {
      await db.delete(sessions).where(eq(sessions.id, sessionId))
      return { session: null, user: null }
    }

    if (Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15) {
      session.expiresAt = new Date(Date.now() + 30 * DAY_IN_MS)
      await db.update(sessions).set(session).where(eq(sessions.id, sessionId))
    }
    return { session, user }
  }

  return { session: null, user: null }
}

const invalidateSessionToken = async (sessionID: string) => {
  await db.delete(sessions).where(eq(sessions.id, sessionID))
}

type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>

export {
  generateSessionToken,
  createSession,
  validateSessionToken,
  invalidateSessionToken,
  type SessionValidationResult
}
