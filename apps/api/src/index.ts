import { Hono } from 'hono'
import { logger } from 'hono/logger'

import Bun from 'bun'

const app = new Hono()

app.use('*', logger())

app.get('/', ({ json }) => {
  return json({ message: 'Hello world!' })
})

app.get('/health', ({ json }) => {
  return json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

app.onError((err, { json }) => {
  console.error(`[Error] ${err.message}`)
  console.error(err.stack)

  if (Bun.env.NODE_ENV === 'production') {
    return json(
      {
        error: {
          message: 'Internal Server Error',
          id: crypto.randomUUID()
        }
      },
      500
    )
  }

  return json(
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
  port: Number(Bun.env.PORT) || 3000,
  fetch: app.fetch
}
