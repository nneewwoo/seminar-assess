import { Hono } from 'hono'
import type { Session, User } from '@seminar-assess/db'
import { handleAuth } from '../../../lib/middleware'

interface Variables {
  user: User | null
  session: Session | null
}

const guarded = new Hono<{ Variables: Variables }>()

guarded.use(
  '*',
  handleAuth
)

guarded.get('/v1/test-bearer-token', async (context) => {
  return context.json({ message: 'Test Bearer Token' })
})

export default guarded
