import { store } from '$lib/store'
import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'
import { db } from '$lib/localdb'

export const load: LayoutLoad = async () => {
  const session =
    store.get('session-token') ||
    (await db.session.orderBy(':id').first())?.token
  if (!session) {
    redirect(302, '/account/signin/steps/email')
  }
}
