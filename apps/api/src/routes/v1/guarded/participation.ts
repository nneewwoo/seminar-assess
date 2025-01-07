import { Hono } from 'hono'
import type { Variables } from '../../../lib/types'
import { db, type Cycle, type User } from '@seminar-assess/db'

const participation = new Hono<{ Variables: Variables }>()

participation.get('/:id?', async ({ req, json, get }) => {
  const { id } = req.param()

  let userId = ''

  if (!id) {
    const user = get('user')
    if (user) {
      userId = user.id
    }
  } else {
    userId = id
  }

  const participation = await db.participation.findFirst({
    where: { userId, cycle: { active: true } }
  })

  if (participation) {
    return json({ success: true, body: participation })
  }

  return json({
    success: false,
    body: { error: 'User has no participation in the current cycle' }
  })
})

participation.get('/set/pretest', async ({ get, json }) => {
  const user = get('user') as User
  const cycle = get('cycle') as Cycle

  await db.participation.update({
    where: { userId_cycleId: { userId: user.id, cycleId: cycle.id } },
    data: { answeredPre: true }
  })

  return json({ success: true })
})

participation.get('/set/posttest', async ({ get, json }) => {
  const user = get('user') as User
  const cycle = get('cycle') as Cycle

  await db.participation.update({
    where: { userId_cycleId: { userId: user.id, cycleId: cycle.id } },
    data: { answeredPost: true }
  })

  return json({ success: true })
})

export default participation
