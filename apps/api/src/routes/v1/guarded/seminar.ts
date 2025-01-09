import { db, type Session, type User, type Vote } from '@seminar-assess/db'
import type { ServerWebSocket } from 'bun'
import { Hono } from 'hono'
import { createBunWebSocket } from 'hono/bun'
import type { Variables } from '../../../lib/types'
import { server } from '../../..'

const { upgradeWebSocket } = createBunWebSocket<ServerWebSocket>()

const seminar = new Hono<{ Variables: Variables }>()

seminar.get('/', async ({ get, json }) => {
  const session = get('session')

  if (!session) {
    return json({ success: false, body: { error: 'unauthorized' } })
  }

  const seminars = await db.seminar.findMany({
    where: { cycle: { active: true } }
  })

  const votes: Vote[] = []

  if (seminars) {
    const draftedVotes = await db.vote.findMany({
      where: { userId: session.userId },
      include: { seminar: true }
    })

    if (draftedVotes.length > 0) {
      return json({ success: true, body: draftedVotes })
    }
    for (const seminar of seminars) {
      const newVote = await db.vote.create({
        data: {
          userId: session.userId,
          seminarId: seminar.id,
          cycleId: seminar.cycleId,
          rank: 0
        },
        include: { seminar: true }
      })
      votes.push(newVote)
    }
    console.log(votes)
    return json({ success: true, body: votes })
  }

  return json({ success: false, body: { error: 'unknown' } })
})

seminar.post('/', async ({ req, json }) => {
  const { title, courseId, description, cycleId } = await req.json()

  const newSeminar = await db.seminar.create({
    data: {
      title,
      description,
      courseId,
      cycleId
    }
  })

  if (newSeminar) {
    return json({ success: true })
  }
  return json({ success: false, body: { error: 'unknown' } })
})

seminar.get(
  '/vote/ws',
  upgradeWebSocket(() => ({
    onOpen: (_, ws) => {
      const rawWs = ws.raw as unknown as ServerWebSocket
      rawWs.subscribe('votes')
    },
    onClose: (_, ws) => {
      const rawWs = ws.raw as unknown as ServerWebSocket
      rawWs.unsubscribe('votes')
    }
  }))
)

seminar.post('/vote', async ({ req, get, json }) => {
  type RequestData = {
    id: string
    seminarId: string
    cycleId: string
    rank: number
  }[]
  const newVote = await req.json<RequestData>()

  const user = get('user') as User

  for (const vote of newVote) {
    const synced = await db.vote.update({
      where: {
        userId_seminarId_cycleId: {
          userId: user.id,
          seminarId: vote.seminarId,
          cycleId: vote.cycleId
        }
      },
      data: {
        rank: vote.rank
      }
    })
    if (!synced) {
      return json({ success: false, body: { error: 'unknown' } })
    }
  }

  const seminars = await db.seminar.findMany({
    where: { cycleId: newVote[0].cycleId },
    include: { votes: true }
  })

  const rankedSeminars = seminars
    .map((seminar) => {
      const totalRank = seminar.votes.reduce((sum, vote) => sum + vote.rank, 0)
      const averageRank = totalRank / seminar.votes.length
      return {
        id: seminar.id,
        title: seminar.title,
        description: seminar.description,
        rank: averageRank
      }
    })
    .sort((a, b) => a.rank - b.rank)
  let currentRank = 0
  let tieCount = 0
  let previousTotalRank: number | null = null

  const rankedWithPosition = rankedSeminars.map((seminar, _index) => {
    if (seminar.rank !== previousTotalRank) {
      currentRank += 1 + tieCount // Increment by 1 + the number of tied ranks
      tieCount = 0 // Reset tie count for the new rank
    } else {
      tieCount++ // Increment tie count if ranks are the same
    }

    previousTotalRank = seminar.rank

    return {
      ...seminar,
      position: currentRank
    }
  })

  server.publish('votes', JSON.stringify(rankedWithPosition))

  await db.participation.update({
    where: {
      userId_cycleId: { userId: user.id, cycleId: newVote[0].cycleId }
    },
    data: {
      voted: true
    }
  })

  return json({ success: true })
})

export default seminar
