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

cycle.get('/open-voting', async ({ json }) => {
  const cycle = await db.cycle.update({
    where: { active: true },
    data: { period: 'VOTING' }
  })
  if (cycle) {
    return json({ success: true })
  }
  return json({ success: false, body: { error: 'unknown' } })
})

cycle.get('/open-pre', async ({ json }) => {
  const cycle = await db.cycle.update({
    where: { active: true },
    data: { period: 'PRE_TEST' }
  })
  if (cycle) {
    return json({ success: true })
  }
  return json({ success: false, body: { error: 'unknown' } })
})

cycle.get('/open-seminar', async ({ json }) => {
  const cycle = await db.cycle.update({
    where: { active: true },
    data: { period: 'SEMINAR' }
  })
  if (cycle) {
    return json({ success: true })
  }
  return json({ success: false, body: { error: 'unknown' } })
})

cycle.get('/open-post', async ({ json }) => {
  const cycle = await db.cycle.update({
    where: { active: true },
    data: { period: 'POST_TEST' }
  })
  if (cycle) {
    return json({ success: true })
  }
  return json({ success: false, body: { error: 'unknown' } })
})

cycle.get('/open-eval', async ({ json }) => {
  const cycle = await db.cycle.update({
    where: { active: true },
    data: { period: 'EVALUATION' }
  })
  if (cycle) {
    return json({ success: true })
  }
  return json({ success: false, body: { error: 'unknown' } })
})

cycle.get('/close-eval', async ({ json }) => {
  const cycle = await db.cycle.update({
    where: { active: true },
    data: { period: 'IDLE', active: false }
  })
  if (cycle) {
    await db.cycle.create({
      data: {
        period: 'IDLE',
        active: true,
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      }
    })

    return json({ success: true })
  }
  return json({ success: false, body: { error: 'unknown' } })
})

export default cycle
