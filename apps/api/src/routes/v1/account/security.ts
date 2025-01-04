import { db } from '@seminar-assess/db'
import { Hono } from 'hono'
import * as otp from '../../../lib/otp'

const security = new Hono()

security.post('/otp/request', async ({ req, json }) => {
  const { email, _name } = await req.json()

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

  // TODO: Mailgun API

  if (Bun.env.NODE_ENV === 'development') {
    console.log('DEV OTP', code)
    return json({ success: true })
  }
})

export default security
