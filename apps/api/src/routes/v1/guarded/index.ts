import { Hono, type Context, type Next } from 'hono'
import { type User, type Session, db } from '@seminar-assess/db'
import { guard } from '../../../lib/middleware'
import { invalidateSession } from '../../../lib/auth'
import seminar from './seminar'
import cycle from './cycle'
import question from './question'

interface Variables {
  user: User | null
  session: Session | null
}

const guarded = new Hono<{ Variables: Variables }>()

const _guardExcept = (path: string[]) => {
  return async (c: Context, next: Next) => {
    if (path.includes(c.req.path)) {
      return await next() // Skip the guard middleware
    }
    return await guard(c, next) // Apply the guard middleware
  }
}

guarded.use('*', guard)

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

export default guarded
