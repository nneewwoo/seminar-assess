import { Hono } from 'hono'
import { logger } from 'hono/logger'
import Bun, { type ServerWebSocket } from 'bun'
import { HTTPException } from 'hono/http-exception'
import { cors } from 'hono/cors'
import v1 from './routes/v1'
import { createBunWebSocket } from 'hono/bun'

const { websocket } = createBunWebSocket<ServerWebSocket>()

const app = new Hono()

app.use('*', logger())

app.use(
  '*',
  cors({
    origin:
      Bun.env.NODE_ENV === 'production'
        ? ['http://tauri.localhost']
        : '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: [
      'Authorization',
      'Content-Type',
      'Accept',
      'Upgrade-Insecure-Requests'
    ],
    exposeHeaders: ['Content-Length', 'Content-Type'],
    maxAge: 1800,
    credentials: true
  })
)

app.route('/v1', v1)

app.get('*', ({ json }) => {
  return json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

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

const server = Bun.serve({
  fetch: (req, server) => {
    return app.fetch(req, { ip: server.requestIP(req), server })
  },
  websocket,
  ...(Bun.env.NODE_ENV === 'development' && { hostname: '0.0.0.0' })
})

console.log(`Server is running on ${server.hostname}, port ${server.port}`)

export { server }
