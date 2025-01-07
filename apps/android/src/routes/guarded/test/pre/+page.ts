import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ parent }) => {
  const { answered, unanswered } = await parent()

  if (unanswered === 0) {
    redirect(308, '/guarded/test/pre/result')
  }
  if (answered > 0) {
    redirect(308, '/guarded/test/pre/resume')
  }
  return {}
}
