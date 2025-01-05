import { store } from '$lib/store'
import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from '../$types'

export const load: LayoutLoad = async () => {
  const session = store.get('session-token')

  if (session) {
    redirect(302, '/guarded/init')
  }
  return {}
}
