import { db, type Answer } from '@seminar-assess/db'
import { Hono } from 'hono'
import type { Variables } from '../../../lib/types'

const question = new Hono<{ Variables: Variables }>()

question.get('/list', async ({ json }) => {
  const cycle = await db.cycle.findFirst({
    where: {
      active: true
    },
    include: {
      seminar: {
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
    seminar: (typeof cycle.seminar)[number]
    votes: number
  }

  const seminar = cycle.seminar.reduce<Winner | null>((winner, other) => {
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

question.post('/answer', async ({ get, req, json }) => {
  const { newAnswer } = await req.json<{ newAnswer: Answer }>()

  const user = get('user')

  if (user) {
    const answer = await db.answer.create({
      data: {
        id: newAnswer.id,
        optionId: newAnswer.optionId,
        questionId: newAnswer.questionId,
        for: newAnswer.for,
        userId: user.id
      }
    })

    if (answer) {
      return json({ success: true })
    }
    return json({ success: false, body: { error: 'unknown' } })
  }

  return json({ success: false, body: { error: 'unknown' } })
})

export default question
