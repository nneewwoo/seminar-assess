import { db, type Answer } from '@seminar-assess/db'
import { Hono } from 'hono'
import type { Variables } from '../../../lib/types'

const question = new Hono<{ Variables: Variables }>()

question.get('/list', async ({ json }) => {
  const cycle = await db.cycle.findFirst({
    where: {
      active: true
    }
  })

  if (!cycle) {
    return json({ success: false, body: { error: 'No active cycle found' } })
  }

  const seminars = await db.seminar.findMany({
    where: { cycleId: cycle.id },
    include: { votes: true }
  })

  const rankedSeminars = seminars
    .map((seminar) => {
      const totalRank = seminar.votes.reduce((sum, vote) => sum + vote.rank, 0)
      const averageRank = totalRank / seminar.votes.length
      return {
        id: seminar.id,
        title: seminar.title,
        description: seminar.description,
        rank: averageRank
      }
    })
    .sort((a, b) => a.rank - b.rank)

  let currentRank = 0
  let tieCount = 0
  let previousTotalRank: number | null = null

  const rankedWithPosition = rankedSeminars.map((seminar, _index) => {
    if (seminar.rank !== previousTotalRank) {
      currentRank += 1 + tieCount // Increment by 1 + the number of tied ranks
      tieCount = 0 // Reset tie count for the new rank
    } else {
      tieCount++ // Increment tie count if ranks are the same
    }

    previousTotalRank = seminar.rank

    return {
      ...seminar,
      position: currentRank
    }
  })

  if (!rankedWithPosition) {
    console.log('no rank')
    return json({ success: false, body: { error: 'No seminar found' } })
  }

  const questions = await db.question.findMany({
    where: {
      seminarId: rankedWithPosition[0].id
    },
    include: {
      options: true
    }
  })

  if (questions && questions.length > 0) {
    return json({
      success: true,
      body: { questions: questions.sort(() => Math.random() - 0.5) }
    })
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
