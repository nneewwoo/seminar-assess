import { store } from '$lib/store'
import { db } from '$lib/localdb'

interface IResponse<T> {
  success: boolean
  body: T
}

export const useFetch = async <T>(
  method: 'GET' | 'POST',
  url: string,
  data?: unknown
) => {
  const token =
    store.get('session-token') ||
    (await db.session.orderBy(':id').first())?.token

  const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(method === 'POST' && { 'Content-Type': 'application/json' })
    },
    ...(method === 'POST' && { body: JSON.stringify(data) })
  })

  const body = await response.json()
  return body as IResponse<T>
}
