import { Hono } from 'hono'
import { db } from '@seminar-assess/db'
import { users } from '@seminar-assess/db/schema'
import { eq } from '@seminar-assess/db/drizzle'
import Bun from 'bun'

const app = new Hono()

app.get('/', async ({ json }) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, 'email@email.com'))

  return json(result)
})

Bun.serve({
  port: Bun.env.PORT || 3000,
  fetch: app.fetch
})
