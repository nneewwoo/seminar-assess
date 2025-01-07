import { error, redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { useFetch } from '$lib/utils'
import type {
  Seminar,
  Cycle,
  Period,
  Question,
  Participation,
  Evaluation
} from '$lib/types'
import { db } from '$lib/localdb'
import { v4 as uuiv4 } from 'uuid'

const to = (period: Period) => {
  return {
    VOTING: '/guarded/voting',
    PRE_TEST: '/guarded/test/pre',
    SEMINAR: '/guarded/seminar-ongoing',
    POST_TEST: '/guarded/test/post',
    EVALUATION: '/guarded/evaluation',
    IDLE: '/guarded/idle'
  }[period]
}

const update = async (period: Period) => {
  switch (period) {
    case 'VOTING':
      {
        await db.seminars.clear()
        const newSeminarList = await useFetch<Seminar[]>('GET', '/seminar')
        await db.seminars.bulkAdd(newSeminarList.body)
      }
      break
    case 'PRE_TEST':
    case 'POST_TEST':
      {
        await db.questions.clear()
        const newQuestionList = await useFetch<Question[]>(
          'GET',
          '/question/list'
        )
        await db.questions.bulkAdd(newQuestionList.body)

        if (period === 'POST_TEST') {
          await db.participation.clear()
          const newParticipation = await useFetch<Participation>(
            'GET',
            '/participation'
          )
          if (newParticipation.success) {
            await db.participation.add(newParticipation.body)
          }
        }
      }
      break
    case 'EVALUATION':
      {
        break
      }
      break
  }
}

export const load: PageLoad = async ({ parent }) => {
  const { session: _ } = await parent()

  const storedCycle = await db.cycle.orderBy(':id').first()

  if (storedCycle) {
    if (typeof window !== 'undefined' && window.navigator.onLine) {
      const currentCycle = await useFetch<Cycle>('GET', '/cycle/current')

      if (!currentCycle || !currentCycle.success) {
        throw error(500, { message: 'An unknown error occured' })
      }

      if (currentCycle.body.id !== storedCycle.id) {
        await db.cycle.clear()
        await db.seminars.clear()
        await db.questions.clear()
        await db.votes.clear()
        await db.participation.clear()

        await db.cycle.add(currentCycle.body)

        const { period } = currentCycle.body

        await update(period)

        return redirect(302, to(period))
      }

      if (currentCycle.body.period !== storedCycle.period) {
        await update(currentCycle.body.period)
        await db.cycle.update(storedCycle.id, {
          period: currentCycle.body.period
        })

        return redirect(302, to(currentCycle.body.period))
      }
    }
    return redirect(302, to(storedCycle.period))
  }
  const currentCycle = await useFetch<Cycle>('GET', '/cycle/current')

  if (!currentCycle || !currentCycle.success) {
    throw error(500, { message: 'An unknown error occured' })
  }

  const participation = await useFetch<Participation>('GET', '/participation')

  if (participation.success) {
    await db.participation.add(participation.body)
  }

  await db.cycle.add(currentCycle.body)
  await update(currentCycle.body.period)

  const response = await useFetch<Evaluation[]>('GET', '/evaluation')

  if (response.success) {
    await db.evaluations.clear()
    await db.evaluations.bulkAdd(response.body)

    for (const evaluation of response.body) {
      await db.evaluationAnswers.bulkAdd(
        evaluation.questions.map((question) => ({
          id: uuiv4(),
          evaluationId: evaluation.id,
          questionId: question.id,
          answer: '',
          synced: false,
          text: question.text,
          type: evaluation.type
        }))
      )
    }
  }

  return redirect(302, to(currentCycle.body.period))
}
