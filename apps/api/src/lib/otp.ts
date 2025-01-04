import { generateHOTP, verifyHOTP } from '@oslojs/otp'

const encode = (email: string) => new TextEncoder().encode(email)

const generate = (email: string, counter: bigint) =>
  generateHOTP(encode(email), counter, 6)
const verify = (email: string, counter: bigint, otp: string) =>
  verifyHOTP(encode(email), counter, 6, otp)

export { generate, verify }
