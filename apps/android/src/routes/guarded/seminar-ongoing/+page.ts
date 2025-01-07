import { db } from '$lib/localdb'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  const participation = await db.participation.orderBy('id').first()

  if (participation) {
    if (!participation.answeredPre) {
      throw error(403, {
        message:
          'Zoinks!//Looks like you missed the pre-test pit stop! No entry to the seminar without it. Next time, buckle up for the quiz adventure first!'
      })
    }
  }
}
