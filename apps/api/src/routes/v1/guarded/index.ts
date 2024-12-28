import { Hono } from 'hono'
import Bun from 'bun'

const guarded = new Hono()

guarded.get('/v1', async (context) => {
  console.log(Bun.env)
  return context.json({ message: 'Here' })
})

export default guarded
