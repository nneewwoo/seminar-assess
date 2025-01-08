import { error, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { db } from '@seminar-assess/db'

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData()

    const email = data.get('email') as string
    const name = data.get('name') as string
    const password = data.get('password') as string
    const confirm = data.get('confirm') as string

    if (!email || !name || !password || !confirm) {
      return fail(400, { error: 'All fields are required' })
    }

    if (password !== confirm) {
      return fail(400, { error: 'Passwords do not match' })
    }

    const newAdmin = await db.user.create({
      data: {
        email,
        name,
        password,
        role: 'ADMIN'
      }
    })

    if (!newAdmin) {
      return fail(500, { error: 'Failed to create new admin account' })
    }

    return {
      success: true
    }
  }
}
