import { db } from '@seminar-assess/db'
import { Hono } from 'hono'
import { z } from 'zod'
import Bun from 'bun'
import { createSession, generateSessionToken } from '../../../lib/auth'

const signin = new Hono()

signin.post('/email', async ({ req, json }) => {
  const { email } = await req.json()

  try {
    const valid = z
      .object({
        email: z
          .string()
          .email({ message: 'Please enter a valid email address' })
      })
      .parse({ email })

    if (valid) {
      const user = await db.user.findUnique({ where: { email } })

      if (user) {
        return json({ success: true, body: { name: user.givenName } })
      }
      return json({
        success: false,
        body: {
          error: 'Could not find user with that email'
        }
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ success: false, body: { error: error.errors } })
    }
  }
  return json({ success: false, body: { error: 'unknown' } })
})

signin.post('/password', async ({ req, json }) => {
  const { email, password } = await req.json()

  const user = await db.user.findUnique({ where: { email } })
  if (user) {
    const valid = await Bun.password.verify(password, user.password)

    if (valid) {
      const token = generateSessionToken()
      const session = await createSession(token, user.id)

      return json({
        success: true,
        body: { token, role: user.role, id: session.id }
      })
    }
    return json({ success: false, body: { error: 'Invalid password' } })
  }
  return json({
    success: false,
    body: {
      error: 'Could not find user'
    }
  })
})

export default signin
