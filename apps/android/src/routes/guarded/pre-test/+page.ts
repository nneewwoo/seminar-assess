import { db } from '$lib/localdb'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  const voted = (await db.votes.toArray()).length > 0

  if (!voted) {
    throw error(403, {
      message:
        'You must vote in the seminar survey to take the pre-test. Vote in future surveys to proceed.'
    })
  }

  return {}
}
