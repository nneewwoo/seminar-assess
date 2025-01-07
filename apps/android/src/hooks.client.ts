import type { Handle, HandleClientError } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  console.log('HOOK', event.request.url)
  return await resolve(event)
}

export const handleError: HandleClientError = async ({ message }) => {
  // TODO: send to error tracking service
  console.error('Client error:', message)
  return {
    message
  }
}
