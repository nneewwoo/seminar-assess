import { db } from '$lib/localdb'
import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url }) => {
  const evaluationId = url.searchParams.get('evaluationId') || ''

  const questions = await db.evaluationAnswers
    .orderBy(':id')
    .toArray()
    .then((q) => q.filter((q) => q.evaluationId === evaluationId))

  const index = Number(url.searchParams.get('index')) || 0

  if (index >= questions.length) {
    redirect(308, '/guarded/evaluation/done')
  }

  return {
    question: questions[index],
    evaluationId,
    index
  }
}
