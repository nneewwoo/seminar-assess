import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import { db } from '@seminar-assess/db'

export const load: PageLoad = async ({ params }) => {
  const { token } = params

  const valid = await db.tempLink.findUnique({ where: { token } })

  if (!valid) {
    return error(404, { message: 'Link expired or invalid' })
  }

  return {
    token
  }
}
