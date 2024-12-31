import type { Context, MiddlewareHandler, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import * as auth from '../auth'

const guard: MiddlewareHandler = async (context: Context, next: Next) => {
  const { req, res } = context
  const token = req.header('Authorization')?.split(' ')[1]

  if (!token) {
    context.set('user', null)
    context.set('session', null)
    throw new HTTPException(400, {
      res,
      message: 'Bad request',
      cause: 'Missing token'
    })
  }

  const { session, user } = await auth.validateSessionToken(token)

  if (session) {
    context.set('user', user)
    context.set('session', session)
  } else {
    context.set('user', null)
    context.set('session', null)
    throw new HTTPException(401, {
      res,
      message: 'Unauthorized',
      cause: 'Invalid or expired token'
    })
  }

  await next()
}

export { guard }
