import { db, type Eval, type User } from '@seminar-assess/db'
import { Hono } from 'hono'
import type { Variables } from '../../../lib/types'

const evaluation = new Hono<{ Variables: Variables }>()

evaluation.get('/', async ({ json }) => {
  const evaluations = await db.evaluation.findMany({
    include: { questions: true }
  })

  return json({ success: true, body: evaluations })
})

evaluation.post('/answer', async ({ req, json, get }) => {
  type RequestBody = {
    id: string
    evaluationId: string
    answer: string
    questionId: string
    type: Eval
  }

  const { id, evaluationId, answer, questionId, type } =
    await req.json<RequestBody>()

  const existingAnswer = await db.evaluationAnswer.findFirst({ where: { id } })

  if (existingAnswer) {
    const updated = await db.evaluationAnswer.update({
      where: { id: existingAnswer.id },
      data: {
        answer
      }
    })
    if (updated) {
      return json({ success: true })
    }
  } else {
    const user = get('user') as User

    const created = await db.evaluationAnswer.create({
      data: {
        userId: user.id,
        id,
        evaluationId,
        answer,
        questionId,
        type
      }
    })
    if (created) {
      return json({ success: true })
    }
  }
  return json({ success: false, body: { error: 'unknown' } })
})

evaluation.get('/answers', async ({ json }) => {
  const answers = await db.evaluationAnswer.findMany({
    include: { question: true, user: true }
  })

  return json({ success: true, body: answers })
})

export default evaluation
