import { db } from '$lib/localdb'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ parent }) => {
  const { allQuestions } = await parent()

  const answers = await db.answers.where('for').equals('PRE_TEST').toArray()

  const review = allQuestions.map((q) => {
    const answer = answers.find((a) => a.questionId === q.id)

    const selected = answer
      ? q.options.find((o) => o.id === answer.optionId)
      : null

    return {
      ...q,
      answer: selected ? selected.id : null
    }
  })

  return {
    review
  }
}
