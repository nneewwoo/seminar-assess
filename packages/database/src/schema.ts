import { relations } from 'drizzle-orm'
import { pgTable, varchar, uuid, timestamp } from 'drizzle-orm/pg-core'

const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  firstName: varchar().notNull(),
  familyName: varchar().notNull(),
  email: varchar().notNull().unique(),
  password: varchar().notNull()
})

const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions)
}))

const sessions = pgTable('sessions', {
  id: uuid().primaryKey().defaultRandom(),
  expiresAt: timestamp().notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull()
})

const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}))

export { users, userRelations, sessions, sessionRelations }
