import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import Bun from 'bun'

const db = drizzle({ client: neon(Bun.env.DATABASE_URL || '') })

export { db }
