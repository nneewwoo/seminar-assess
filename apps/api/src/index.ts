import { Hono } from 'hono'
import { logger } from 'hono/logger'
import Bun from 'bun'
import guarded from './routes/v1/guarded'
import { HTTPException } from 'hono/http-exception'

const app = new Hono()

app.use(
  '*',
  logger((text) => console.log('[LOG]', text))
)

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

app.route('/', guarded)

app.onError((err, { json }) => {
  const id = crypto.randomUUID()

  console.error(`[Error] ${id} - ${err.message} - ${err.cause}`)

  if (err instanceof HTTPException) {
    if (Bun.env.NODE_ENV === 'production') {
      return json(
        {
          error: {
            message: err.message,
            id
          }
        },
        err.status
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
      err.status
    )
  }

  if (Bun.env.NODE_ENV === 'production') {
    return json(
      {
        error: {
          message: 'Internal Server Error',
          id
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
