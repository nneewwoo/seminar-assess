import { type User, type Session, db, type Seminar } from '@seminar-assess/db'
import { Hono } from 'hono'
import type { Variables } from '../../../lib/types'

const question = new Hono<{ Variables: Variables }>()

question.get('/list', async ({ json }) => {
  const cycle = await db.cycle.findFirst({
    where: {
      active: true
    },
    include: {
      Seminar: {
        include: {
          _count: {
            select: {
              votes: true
            }
          },
          votes: true
        }
      }
    }
  })

  if (!cycle) {
    return json({ success: false, body: { error: 'No active cycle found' } })
  }

  type Winner = {
    seminar: (typeof cycle.Seminar)[number]
    votes: number
  }

  const seminar = cycle.Seminar.reduce<Winner | null>((winner, other) => {
    const votes = other._count.votes

    if (!winner || votes > winner.votes) {
      return { seminar: other, votes }
    }
    return winner
  }, null)?.seminar

  if (!seminar) {
    return json({ success: false, body: { error: 'No seminar found' } })
  }

  const questions = await db.question.findMany({
    where: {
      seminarId: seminar.id
    },
    include: {
      options: true
    }
  })

  if (questions && questions.length > 0) {
    return json({ success: true, body: questions })
  }

  return json({
    success: false,
    body: { error: 'No questions found for the seminar' }
  })
})

export default question
