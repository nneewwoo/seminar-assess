import { db, type Session, type User } from '@seminar-assess/db'
import { Hono } from 'hono'

interface Variables {
  user: User | null
  session: Session | null
}

const seminar = new Hono<{ Variables: Variables }>()

seminar.get('/', async ({ get, json }) => {
  const session = get('session')

  if (!session) {
    return json({ success: false, body: { error: 'unauthorized' } })
  }

  const seminars = await db.seminar.findMany({
    where: {
      cycle: {
        active: true
      }
    },
    include: {
      course: true,
      votes: {
        where: {
          userId: session.userId
        }
      },
      _count: {
        select: {
          votes: true
        }
      }
    }
  })

  if (seminars) {
    const list = seminars.map((seminar) => ({
      id: seminar.id,
      title: seminar.title,
      description: seminar.description,
      course: seminar.course,
      numberOfVotes: seminar._count.votes,
      votedByUser: seminar.votes.length > 0
    }))
    return json({ success: true, body: list })
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
