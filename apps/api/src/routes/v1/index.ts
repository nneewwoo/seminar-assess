import { Hono } from 'hono'
import signup from './account/signup'
import guarded from './guarded'
import signin from './account/signin'
import security from './account/security'
import type { Variables } from '../../lib/types'
import { invalidateSession } from '../../lib/auth'

const v1 = new Hono<{ Variables: Variables }>()
v1.route('/account/signup/steps', signup)
v1.route('/account/signin/steps', signin)
v1.route('/account/security', security)
v1.route('/', guarded)

v1.get('/account/signout', async ({ get, json }) => {
  const session = get('session')

  if (session) {
    await invalidateSession(session.id)

    return json({ success: true })
  }

  return json({ success: false, body: { error: 'unknown' } })
})

export default v1
