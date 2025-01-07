import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { db } from '$lib/localdb'

export const load: PageLoad = async ({ parent }) => {
  const { allQuestions, over } = await parent()

  const answers = await db.answers.where('for').equals('PRE_TEST').toArray()

  if (answers.length === 0) {
    redirect(308, '/guarded/test/pre')
  }

  const correct = answers.reduce((count, answer) => {
    const question = allQuestions.find((q) => q.id === answer.questionId)
    if (question) {
      const selected = question.options.find((o) => o.id === answer.optionId)
      if (selected?.isCorrect) {
        return count + 1
      }
    }
    return count
  }, 0)

  const percentage = (correct / over) * 100

  return { correct, percentage }
}
