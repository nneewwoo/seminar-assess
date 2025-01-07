import { Keys } from '$lib/constants'
import { db } from '$lib/localdb'
import { store } from '$lib/store'
import type { LayoutLoad } from './$types'

export const prerender = true
export const ssr = false

export const load: LayoutLoad = async () => {
  const session = await db.session.orderBy(':id').first()
  if (session) {
    store.set(Keys.SESSION_TOKEN, session.token)
  }
  return {}
}
