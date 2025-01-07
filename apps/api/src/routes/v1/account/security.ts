import { db } from '@seminar-assess/db'
import { Hono } from 'hono'
import * as otp from '../../../lib/otp'

const security = new Hono()

security.post('/otp/request', async ({ req, json }) => {
  const { email, name } = await req.json()

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

  const MAILGUN_API_KEY = Bun.env.MAILGUN_API_KEY
  const MAILGUN_DOMAIN = Bun.env.MAILGUN_DOMAIN

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

  if (Bun.env.NODE_ENV === 'development') {
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
})

export default security
