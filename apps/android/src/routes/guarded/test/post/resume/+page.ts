import { db } from '$lib/localdb'
import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ parent }) => {
  const { over } = await parent()
  const answers = await db.answers.where('for').equals('POST_TEST').toArray()

  if (answers.length >= over) {
    redirect(308, '/guarded/test/post/result')
  }
  return {
    answered: answers.length
  }
}
