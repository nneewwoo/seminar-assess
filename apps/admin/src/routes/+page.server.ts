import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { generateSessionToken } from '$lib/auth'

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.session) {
    const admin = generateSessionToken()
    redirect(302, `/${admin}`)
  }
  redirect(302, '/account/signin')
}
