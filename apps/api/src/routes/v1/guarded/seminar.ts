import { db, type Session, type User } from '@seminar-assess/db'
import type { ServerWebSocket } from 'bun'
import { Hono } from 'hono'
import { createBunWebSocket } from 'hono/bun'
import type { Variables } from '../../../lib/types'
import { server } from '../../..'

const { upgradeWebSocket } = createBunWebSocket<ServerWebSocket>()

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

seminar.get(
  '/vote/ws',
  upgradeWebSocket(() => ({
    onOpen: (_, ws) => {
      const rawWs = ws.raw as unknown as ServerWebSocket
      rawWs.subscribe('votes')
    },
    onClose: (_, ws) => {
      const rawWs = ws.raw as unknown as ServerWebSocket
      rawWs.unsubscribe('votes')
    }
  }))
)

seminar.post('/vote', async ({ req, get, json }) => {
  type Request = {
    id: string
    seminarId: string
    cycleId: string
  }
  const { id, seminarId, cycleId } = await req.json<Request>()

  const user = get('user') as User

  const seminar = await db.seminar.update({
    where: { id: seminarId },
    data: {
      votes: {
        create: {
          id,
          userId: user.id,
          cycleId
        }
      }
    },
    include: {
      _count: {
        select: {
          votes: true
        }
      }
    }
  })

  if (seminar) {
    server.publish(
      'votes',
      JSON.stringify({
        id: seminar.id,
        numberOfVotes: seminar._count.votes
      })
    )
    await db.participation.create({
      data: {
        userId: user.id,
        voted: true
      }
    })

    return json({ success: true })
  }
  return json({ success: false, body: { error: 'unknown' } })
})

export default seminar
