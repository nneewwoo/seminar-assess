import { Elysia } from 'elysia'
import db from '@seminar-assess/db'
const app = new Elysia().get('/', async () => {
  const user = await db.user.findMany()
  console.log(user)
})

app.listen(3000)
