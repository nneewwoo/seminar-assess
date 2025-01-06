import Dexie, { liveQuery } from 'dexie'
import type {
  Cycle,
  Participation,
  Question,
  Seminar,
  Session,
  Vote
} from './types'

class Database extends Dexie {
  cycle: Dexie.Table<Cycle, string>
  session: Dexie.Table<Session, string>
  seminars: Dexie.Table<Seminar, string>
  questions: Dexie.Table<Question, string>
  votes: Dexie.Table<Vote, string>
  participation: Dexie.Table<Participation, string>

  constructor(dbName: string) {
    super(dbName)

    this.version(5).stores({
      cycle: 'id, period, ends_at',
      session: 'id, token',
      seminars:
        'id, title, description, course, number_of_votes, voted_by_user',
      questions: 'id,text,options',
      votes: 'id, seminar_id, cycle_id, synced',
      participation: 'id, voted, answered_pre, answered_post, attended'
    })

    this.cycle = this.table('cycle')
    this.session = this.table('session')
    this.seminars = this.table('seminars')
    this.questions = this.table('questions')
    this.votes = this.table('votes')
    this.participation = this.table('participation')
  }

  seminarsSubscription = liveQuery(() => this.seminars.orderBy(':id').toArray())
}

export const db = new Database('localdb')
