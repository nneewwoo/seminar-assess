import { pgTable, varchar, uuid } from 'drizzle-orm/pg-core'

const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  firstName: varchar().notNull(),
  familyName: varchar().notNull(),
  email: varchar().notNull().unique(),
  password: varchar().notNull()
})

export { users }
