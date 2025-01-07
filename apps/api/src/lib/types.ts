import type { Cycle, Session, User } from '@seminar-assess/db'

export interface Variables {
  cycle: Cycle | null
  user: User | null
  session: Session | null
}
