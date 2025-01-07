import type { Context, MiddlewareHandler, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
import * as auth from '../auth'
import type { Variables } from '../types'

const handleAuth = async (
  context: Context<{ Variables: Variables }>,
  token: string | null
) => {
  if (!token) {
    context.set('user', null)
    context.set('session', null)
    throw new HTTPException(400, {
      res: context.res,
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
      res: context.res,
      message: 'Unauthorized',
      cause: 'Invalid or expired token'
    })
  }
}

const guard: MiddlewareHandler = async (context, next) => {
  await handleAuth(
    context,
    context.req.header('Authorization')?.split(' ')[1] || null
  )
  await next()
}

const withWsGuard =
  (paths: string[]): MiddlewareHandler =>
  async (context, next) => {
    if (paths.includes(context.req.path)) {
      await handleAuth(context, context.req.query().token || null)
      await next()
    } else {
      await guard(context, next)
    }
  }

export { guard, withWsGuard }
