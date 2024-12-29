import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'
import Bun from 'bun'

const db = drizzle({ client: neon(Bun.env.DATABASE_URL || ''), schema })

type User = typeof schema.users.$inferSelect
type NewUser = typeof schema.users.$inferInsert
type Session = typeof schema.sessions.$inferSelect
type NewSession = typeof schema.sessions.$inferInsert

export { db }
export type { User, NewUser, Session, NewSession }
