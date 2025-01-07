import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ parent, url, depends }) => {
  const { questions, unanswered } = await parent()

  const hasSkipped = url.searchParams.get('hasSkipped') || false

  const index = Number(url.searchParams.get('index') || 0)
  depends('app:random')

  if (index >= unanswered) {
    if (hasSkipped) {
      redirect(308, '/guarded/test/pre/resume')
    }
    redirect(308, '/guarded/test/pre/result')
  }

  return {
    index,
    question: questions[index],
    hasSkipped
  }
}
