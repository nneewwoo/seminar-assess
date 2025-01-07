import { db } from '@seminar-assess/db'
import type { MiddlewareHandler } from 'hono'

const withCycle: MiddlewareHandler = async (context, next) => {
  const { set } = context

  const cycle = await db.cycle.findUnique({ where: { active: true } })
  if (cycle) {
    set('cycle', cycle)
  }
  await next()
}

export { withCycle }
