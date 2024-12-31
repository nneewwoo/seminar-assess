import { sha1 } from '@oslojs/crypto/sha1'
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase
} from '@oslojs/encoding'
import type { Session } from '@prisma/client'
import { db } from '@seminar-assess/db'

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

const generateSessionToken = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  const token = encodeBase32LowerCaseNoPadding(bytes)
  return token
}

const createSession = async (
  token: string,
  userId: string
): Promise<Session> => {
  const sessionId = uuid(token)
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
  }
  await db.session.create({ data: session })

  return session
}

const validateSessionToken = async (token: string) => {
  const sessionId = uuid(token)
  const result = await db.session.findUnique({
    where: { id: sessionId },
    include: { user: true }
  })

  if (!result) {
    return { session: null, user: null }
  }

  const { user, ...session } = result

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.session.delete({ where: { id: sessionId } })
    return { session: null, user: null }
  }

  if (Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15) {
    session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30)
    await db.session.update({
      where: { id: session.id },
      data: { expiresAt: session.expiresAt }
    })
  }
  return { session, user }
}

const invalidateSession = async (sessionId: string) => {
  await db.session.delete({ where: { id: sessionId } })
}

type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>

export {
  generateSessionToken,
  createSession,
  validateSessionToken,
  invalidateSession,
  type SessionValidationResult
}
