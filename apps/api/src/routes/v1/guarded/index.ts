import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
import { validateSessionToken } from '../../../lib/auth'

const guarded = new Hono()

guarded.use(
  '*',
  bearerAuth({
    verifyToken: async (token, _context) => {
      const { session } = await validateSessionToken(token)

      return session !== null
    },
    invalidTokenMessage: 'Invalid token provided',
    noAuthenticationHeaderMessage: 'No authentication header provided',
    invalidAuthenticationHeaderMessage: 'Invalid authentication header provided'
  })
)

guarded.get('/v1/test-bearer-token', async (context) => {
  return context.json({ message: 'Test Bearer Token' })
})

export default guarded
