import { Hono } from 'hono'
import type { User, Session } from '@seminar-assess/db'
import { guard } from '../../../lib/middleware'

interface Variables {
  user: User | null
  session: Session | null
}

const guarded = new Hono<{ Variables: Variables }>()

guarded.use('*', guard)

guarded.get('/test-bearer-token', async (context) => {
  return context.json({ message: 'Test Bearer Token' })
})

export default guarded
