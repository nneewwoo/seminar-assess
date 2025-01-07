import { db } from '$lib/localdb'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async () => {
  const questions = await db.questions.toArray()

  const answers = await db.answers.where('for').equals('POST_TEST').toArray()

  const unansweredQuestions = questions.filter(
    (q) => !new Set(answers.map((a) => a.questionId)).has(q.id)
  )
  return {
    questions: unansweredQuestions,
    unanswered: unansweredQuestions.length
  }
}
