import { Hono } from 'hono'
import type { Variables } from '../../../lib/types'
import { db } from '@seminar-assess/db'

const user = new Hono<{ Variables: Variables }>()

user.get('/list', async ({ json }) => {
  const users = await db.user.findMany()
  return json({ success: true, body: users })
})

user.get('/exam-results', async ({ get, json }) => {
  const cycle = get('cycle')
  if (!cycle) {
    return json({ success: false, body: { error: 'unknown' } })
  }
  const isPreTestPhase = cycle.period === 'PRE_TEST'

  // Group answers for pre-test and post-test separately
  const results = await db.answer.groupBy({
    by: ['userId', 'for'],
    where: {
      question: {
        seminar: {
          cycleId: cycle.id // Ensure answers are related to the current cycle
        }
      },
      option: {
        isCorrect: true // Only consider correct answers
      }
    },
    _count: {
      _all: true // Count all correct answers
    }
  })

  // Transform the grouped results into a user-wise object for both PRE_TEST and POST_TEST
  const scoresByUser: Record<
    string,
    { pretestScore: number; posttestScore: number }
  > = {}

  for (const result of results) {
    const userId = result.userId
    const isPreTest = result.for === 'PRE_TEST'

    if (!scoresByUser[userId]) {
      scoresByUser[userId] = { pretestScore: 0, posttestScore: 0 }
    }

    if (isPreTest) {
      scoresByUser[userId].pretestScore = result._count._all
    } else {
      scoresByUser[userId].posttestScore = result._count._all
    }
  }

  // Fetch all user names
  const userIds = Object.keys(scoresByUser)
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true }
  })

  // Map results to the desired format
  const finalScores = users.map((user) => {
    const userScores = scoresByUser[user.id] || {
      pretestScore: 0,
      posttestScore: 0
    }

    return {
      name: user.name,
      pretestScore: userScores.pretestScore,
      posttestScore: isPreTestPhase ? 0 : userScores.posttestScore // Default post-test score to 0 if cycle is still in PRE_TEST
    }
  })

  return json({ success: true, body: finalScores })
})

export default user
