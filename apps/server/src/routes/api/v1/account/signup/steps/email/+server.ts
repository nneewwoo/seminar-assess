import prisma from '$lib/prisma'
import { json, type RequestHandler } from '@sveltejs/kit'
import { z } from 'zod'

const POST: RequestHandler = async ({ request, fetch }) => {
  const { email, givenName } = await request.json()

  try {
    const valid = z
      .object({
        email: z.string().email({ message: 'Invalid email address' })
      })
      .parse({ email })

    if (valid) {
      const registered = await prisma.user.findFirst({ where: { email } })
      if (registered) {
        return json({
          success: false,
          body: { error: 'Email already registered' }
        })
      } else {
        const request = await fetch('/api/v1/account/security/otp/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, givenName })
        })
        const data = (await request.json()) as {
          success: boolean
          body?: { error: string }
        }
        return json(data)
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ success: false, body: { error: error.errors } })
    }
  }
  return json({ success: false, error: 'unknown' })
}

export { POST }
