import { db } from '@seminar-assess/db'
import { Hono } from 'hono'
import { z } from 'zod'
import * as otp from '../../../lib/otp'

const signup = new Hono()

signup.post('/name', async ({ req, json }) => {
  const { name } = await req.json()
  try {
    const valid = z.string().min(4, { message: 'Name is required' }).parse(name)

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

signup.post('/email', async ({ req, json }) => {
  const { email, name } = await req.json()

  try {
    const valid = z
      .string()
      .email({ message: 'Invalid email address' })
      .parse(email)

    if (valid) {
      const registered = await db.user.findUnique({ where: { email } })

      if (registered) {
        return json({
          success: false,
          body: { error: 'Email already registered' }
        })
      }

      const baseUrl = new URL(req.url).origin

      const response = await fetch(
        `${baseUrl}/v1/account/security/otp/request`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name })
        }
      )

      const body = (await response.json()) as {
        success: boolean
        body: { error: string }
      }

      return json(body)
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ success: false, body: { error: error.errors } })
    }
  }

  return json({ success: false, body: { error: 'unknown' } })
})

signup.post('/verify-otp', async ({ req, json }) => {
  const { code, email } = await req.json()

  const counter = (await db.otp.findUnique({ where: { email } }))?.counter

  if (typeof counter === 'undefined') {
    return json({
      success: false,
      body: {
        error:
          'We could not find a record of your email address. Please go back and enter your email address again.'
      }
    })
  }

  const valid = otp.verify(email, counter, code)

  if (valid) {
    return json({ success: true })
  }
  return json({
    success: false,
    body: {
      error:
        'The code you entered does not seem to be correct. Try again or request a new code.'
    }
  })
})

signup.post('/password', async ({ req, json }) => {
  const { email, password, name, role } = await req.json()

  const newUser = await db.user.create({
    data: {
      email,
      password,
      name,
      role
    }
  })

  if (newUser) {
    const cycle = await db.cycle.findUnique({where: {active: true}})

    if (cycle) {
      await db.participation.create({data: {
        userId: newUser.id,
        'cycleId': cycle.id
      }})
    }
    return json({ success: true })
  }

  return json({ success: false, body: { error: 'unknown' } })
})

signup.get('/gen-link/:token', async ({ req, json }) => {
  const { token } = req.param()

  const tempLink = await db.tempLink.create({
    data: {
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 72)
    }
  })

  if (tempLink) {
    return json({
      success: true,
      body: {
        link: `${Bun.env.NODE_ENV === 'production' ? 'https' : 'http'}://${Bun.env.DOMAIN_NAME}/account/signup/${encodeURIComponent(token)}`
      }
    })
  }

  return json({ success: false, body: { error: 'unknown' } })
})

signup.get('/verify-link/:token', async ({ req, json }) => {
  const { token } = req.param()

  const tempLink = await db.tempLink.findUnique({ where: { token } })

  if (tempLink) {
    if (new Date(tempLink.expiresAt) > new Date()) {
      return json({ success: true })
    }
    await db.tempLink.delete({ where: { token } })

    return json({ success: false, body: { error: 'Link has expired' } })
  }

  return json({ success: false, body: { error: 'Link not found' } })
})

export default signup
