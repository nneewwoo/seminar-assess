import { error, redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { useFetch } from '$lib/utils'
import type { Seminar, Cycle, Period, Question } from '$lib/types'
import { db } from '$lib/localdb'

const to = (period: Period) => {
  return {
    VOTING: '/guarded/voting',
    PRE_TEST: '/guarded/pre-test',
    SEMINAR: '/guarded/seminar-ongoing',
    POST_TEST: '/guarded/post-test',
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
      }
      break
  }
}

export const load: PageLoad = async () => {
  const storedCycle = await db.cycle.orderBy(':id').first()

  if (storedCycle) {
    if (typeof window !== 'undefined' && window.navigator.onLine) {
      const currentCycle = await useFetch<Cycle>('GET', '/cycle/current')

      if (!currentCycle || !currentCycle.success) {
        throw error(500, { message: 'An unknown error occured' })
      }

      if (currentCycle.body.id !== storedCycle.id) {
        await db.cycle.clear()
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

  await db.cycle.add(currentCycle.body)
  await update(currentCycle.body.period)

  return redirect(302, to(currentCycle.body.period))
}
