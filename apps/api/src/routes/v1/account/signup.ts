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
      let code = ''

      const otpExists = await db.otp.findUnique({ where: { email } })

      if (otpExists) {
        const updatedOtp = await db.otp.update({
          where: { email },
          data: { counter: { increment: 1 } }
        })

        if (updatedOtp) code = otp.generate(email, updatedOtp.counter)
      } else {
        const newOtp = await db.otp.create({ data: { email } })
        code = otp.generate(email, newOtp.counter)
      }

      const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY
      const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN

      const form = new FormData()
      form.append('from', `Seminar Assess <no-reply@${MAILGUN_DOMAIN}>`)
      form.append('to', email)
      form.append('subject', 'Verify your email address')
      form.append(
        'text',
        `Hi ${name},

Thank you for signing up!

Your email verification code is:

${code}

If you did not initiate this request, please disregard this message. Please ensure the confidentiality of your verification code and do not share it with anyone.
Do not forward or give this code to anyone.

This email can't receive replies. If you have any questions or issues, please contact us at contact@seminar-assess.tech.

Seminar Assess
          `
      )
      form.append(
        'html',
        `<!doctype html>
        <html>
          <body>
            <div
              style='background-color:#Ffffff;color:#1C1C14;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0.15008px;line-height:1.5;margin:0;padding:32px 0;min-height:100%;width:100%'
            >
              <table
                align="center"
                width="100%"
                style="margin:0 auto;max-width:600px;background-color:#5F6044;border-radius:16px"
                role="presentation"
                cellspacing="0"
                cellpadding="0"
                border="0"
              >
                <tbody>
                  <tr style="width:100%">
                    <td>
                      <div style="padding:24px 24px 24px 24px;text-align:center">
                        <img
                          alt="Seminar Assess Logo"
                          src="https://raw.githubusercontent.com/nneewwoo/seminar-assess/refs/heads/master/logo.png"
                          width="100"
                          height="100"
                          style="width:100px;height:100px;outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:100%"
                        />
                      </div>
                      <div style="background-color:#FCFAEC;padding:16px 24px 16px 24px">
                        <div
                          style="font-size:20px;font-weight:normal;text-align:center;padding:0px 24px 0px 24px"
                        >
                          <p><strong>Hi ${name},</strong></p>
                        </div>
                        <div
                          style="font-weight:normal;text-align:center;padding:0px 24px 0px 24px"
                        >
                          <p>Thank you for signing up!</p>
                        </div>
                        <div
                          style="font-weight:normal;text-align:center;padding:0px 24px 0px 24px"
                        >
                          <p><strong>Your email verification code is:</strong></p>
                        </div>
                        <div style="padding:0px 0px 0px 0px">
                          <div style="padding:16px 0px 16px 0px">
                            <div style="padding:16px 80px 16px 80px">
                              <div
                                style="background-color:#5E621B;border-radius:8px;padding:8px 0px 8px 0px"
                              >
                                <div
                                  style='color:#FFFFFF;font-size:36px;font-family:"Nimbus Mono PS", "Courier New", "Cutive Mono", monospace;font-weight:bold;text-align:center;padding:0px 0px 0px 0px'
                                >
                                  ${code}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          style="font-size:12px;font-weight:normal;text-align:center;padding:0px 24px 0px 24px"
                        >
                          If you did not initiate this request, please disregard this
                          message. Please ensure the confidentiality of your
                          verification code and do not share it with anyone.
                        </div>
                        <div
                          style="font-size:12px;font-weight:bold;text-align:center;padding:0px 24px 0px 24px"
                        >
                          <p>Do not forward or give this code to anyone.</p>
                        </div>
                      </div>
                      <div
                        style="color:#A3A3A3;font-size:10px;font-weight:normal;text-align:center;padding:8px 24px 0px 24px"
                      >
                        This email can&#x27;t receive replies. If you have any questions or issues, please contact us at <a style="color: white;" href="mailto:contact@seminar-assess.tech">contact@seminar-assess.tech</a>.
                      </div>
                      <div
                        style="color:#FFFFFF;font-size:14px;font-weight:normal;text-align:center;padding:16px 24px 16px 24px"
                      >
                        <p>Seminar Assess</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </body>
        </html>
          `
      )

      if (process.env.NODE_ENV === 'development') {
        console.log('DEV OTP', code)
        return json({ success: true })
      }
      const result = await fetch(
        `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`
          },
          body: form
        }
      )

      const resultData = (await result.json()) as {
        id: string
        message: string
      }

      if (resultData.message.toLocaleLowerCase().includes('queued')) {
        return json({ success: true })
      }
      return json({ success: false, body: { error: 'unknown' } })
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
    const cycle = await db.cycle.findUnique({ where: { active: true } })

    if (cycle) {
      await db.participation.create({
        data: {
          userId: newUser.id,
          cycleId: cycle.id
        }
      })
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
