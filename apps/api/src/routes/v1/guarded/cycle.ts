import { db } from '@seminar-assess/db'
import { Hono } from 'hono'

const cycle = new Hono()

cycle.get('/current', async ({ json }) => {
  const cycle = await db.cycle.findFirst({
    where: { active: true },
    select: { id: true, period: true, endsAt: true }
  })
  if (cycle) {
    return json({ success: true, body: cycle })
  }
  return json({ success: false, body: { error: 'unknown' } })
})

export default cycle
