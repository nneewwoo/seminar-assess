import { random } from '$lib/utils'
import { generateRandomString } from '@oslojs/crypto/random'

export const GET = async ({ url }) => {
  const chars = 'a-zA-Z0-9!@#$%^&*()_+-=[]{}|;:,.<>?/~'

  const token = generateRandomString(random, chars, 32)

  const link = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}/account/signup/${encodeURIComponent(token)}`

  return new Response(link, {
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
