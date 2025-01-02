import { Hono } from 'hono'
import type { User, Session } from '@seminar-assess/db'
import { guard } from '../../../lib/middleware'
import { invalidateSession } from '../../../lib/auth'

interface Variables {
  user: User | null
  session: Session | null
}

const guarded = new Hono<{ Variables: Variables }>()

guarded.use('*', guard)

guarded.get('/account/signout', async ({ get, json }) => {
  const session = get('session')

  if (session) {
    await invalidateSession(session.id)

    return json({ success: true })
  }
  return json({ success: false, body: { error: 'unknown' } })
})

guarded.get('/test-bearer-token', async (context) => {
  return context.json({ message: 'Test Bearer Token' })
})

export default guarded
