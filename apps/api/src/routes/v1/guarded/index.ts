import { Hono } from 'hono'
import { db } from '@seminar-assess/db'
import { withCycle, withWsGuard } from '../../../lib/middleware'
import { invalidateSession } from '../../../lib/auth'
import seminar from './seminar'
import cycle from './cycle'
import question from './question'
import { server } from '../../..'
import type { Variables } from '../../../lib/types'
import participation from './participation'
import evaluation from './evaluation'
import user from './user'

const guarded = new Hono<{ Variables: Variables }>()

guarded.use('*', withWsGuard(['/v1/seminar/vote/ws']))
guarded.use('*', withCycle)

guarded.get('/account/signout', async ({ get, json }) => {
  const session = get('session')

  if (session) {
    await invalidateSession(session.id)

    return json({ success: true })
  }
  return json({ success: false, body: { error: 'unknown' } })
})

guarded.get('/course', async ({ json }) => {
  const courses = await db.course.findMany()
  if (courses) {
    server.publish('course', JSON.stringify(courses))
    return json({ success: true, body: courses })
  }
  return json({ success: false, body: { error: 'unknown' } })
})

guarded.post('/course', async ({ req, json }) => {
  const { name } = await req.json()

  const newCourse = await db.course.create({ data: { name } })

  if (newCourse) {
    return json({ success: true })
  }
  return json({ success: false, body: { error: 'unknown' } })
})

guarded.route('/cycle', cycle)
guarded.route('/seminar', seminar)
guarded.route('/question', question)
guarded.route('/participation', participation)
guarded.route('/evaluation', evaluation)
guarded.route('/user', user)

export default guarded
