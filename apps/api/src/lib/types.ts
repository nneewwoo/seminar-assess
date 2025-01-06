import type { Session, User } from '@seminar-assess/db'

export interface Variables {
  user: User | null
  session: Session | null
}
