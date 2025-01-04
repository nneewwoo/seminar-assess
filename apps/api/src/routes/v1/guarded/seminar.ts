import { db, type Course } from '@seminar-assess/db'
import { Hono } from 'hono'

const seminar = new Hono()

seminar.get('/', async ({ json }) => {
  const seminars = await db.seminar.findMany({
    where: {
      cycle: {
        active: true
      }
    },
    include: {
      course: true
    }
  })

  if (seminars) {
    return json({ success: true, body: seminars })
  }

  return json({ success: false, body: { error: 'unknown' } })
})

seminar.post('/', async ({ req, json }) => {
  const { title, courseId, description, cycleId } = await req.json()

  const newSeminar = await db.seminar.create({
    data: {
      title,
      description,
      courseId,
      cycleId
    }
  })

  if (newSeminar) {
    return json({ success: true })
  }
  return json({ success: false, body: { error: 'unknown' } })
})

export default seminar
