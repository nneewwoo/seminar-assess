import { db } from '$lib/localdb'
import { error } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ url }) => {
  const participation = await db.participation.orderBy('id').first()

  if (url.pathname.includes('/test/pre')) {
    if (!participation?.voted) {
      throw error(403, {
        message:
          'Uh-oh!//You skipped the voting step. No vote, no pre-test! Don’t forget to have your say next time — it’s your chance to steer the ship!'
      })
    }
  }

  if (url.pathname.includes('/test/post')) {
    if (!participation?.attended) {
      throw error(403, {
        message:
          'Oh no!//Oops! You missed the main event. Without attending the seminar, there’s no backstage access to the post-test. See you in the next session!'
      })
    }
  }

  return {}
}
