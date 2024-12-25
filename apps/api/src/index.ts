import { Hono } from 'hono'
import { logger } from 'hono/logger'

import { db } from '@seminar-assess/db'
import { users } from '@seminar-assess/db/schema'

const app = new Hono()

app.use('*', logger())

app.get('/health', ({ json }) => {
  return json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

app.get('/testdb', async ({ json }) => {
  const result = await db.select({ id: users.id }).from(users)

  return json(result)
})

app.onError((err, c) => {
  console.error(`[Error] ${err.message}`)
  console.error(err.stack)

  if (process.env.NODE_ENV === 'production') {
    return c.json(
      {
        error: {
          message: 'Internal Server Error',
          id: crypto.randomUUID()
        }
      },
      500
    )
  }

  return c.json(
    {
      error: {
        message: err.message,
        stack: err.stack
      }
    },
    500
  )
})

export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch
}
