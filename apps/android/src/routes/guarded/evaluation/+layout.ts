import { db } from '$lib/localdb'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async () => {
  const evaluations = await db.evaluations.orderBy(':id').toArray()

  return { evaluations }
}
