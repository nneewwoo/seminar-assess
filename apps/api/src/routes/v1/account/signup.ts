import { db } from '@seminar-assess/db'
import { Hono } from 'hono'
import { z } from 'zod'

const signup = new Hono()

signup.post('/name', async ({ req, json }) => {
  const { givenName, familyName } = await req.json()
  try {
    const valid = z
      .object({
        givenName: z.string().min(1, { message: 'First name is required' }),
        familyName: z.string().min(1, { message: 'Last name is required' })
      })
      .parse({ givenName, familyName })

    if (valid) {
      return json({ success: true })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ success: false, body: { error: error.errors } })
    }
  }
  return json({ success: false, body: { error: 'unknown' } })
})

signup.post('/password', async ({ req, json }) => {
  const { email, password, givenName, familyName, role, confirm } =
    await req.json()

  try {
    const valid = z
      .object({
        password: z
          .string()
          .min(8, { message: 'Password must be at least 8 characters long' }),
        confirm: z.string().min(1, { message: 'Please confirm your password' })
      })
      .refine((data) => data.password === data.confirm, {
        message: 'Passwords do not match. Try again.'
      })
      .parse({ password, confirm })

    if (valid) {
      await db.user.create({
        data: {
          email,
          password,
          givenName,
          familyName,
          role
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

export default signup
