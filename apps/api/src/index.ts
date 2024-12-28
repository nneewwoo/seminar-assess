import { Hono } from 'hono'
import { logger } from 'hono/logger'
import Bun from 'bun'
import guarded from './routes/v1/guarded'

const app = new Hono()

app.use(
  '*',
  logger((text) => console.log('[LOG]', text))
)

app.get('/', ({ json }) => {
  console.log(Bun.env)
  return json({ message: 'Hello world!' })
})

app.get('/health', ({ json }) => {
  return json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

app.route('/', guarded)

app.onError((err, { json }) => {
  console.error(`[Error] ${err.message}`)
  console.error(`[Stack] ${err.stack}`)
  console.error(`[Cause] ${err.cause}`)

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
        stack: err.stack,
        cause: err.cause
      }
    },
    500
  )
})

export default {
  port: Number(Bun.env.PORT) || 3000,
  fetch: app.fetch
}
