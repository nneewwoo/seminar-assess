import Dexie, { liveQuery } from 'dexie'
import type { Cycle, Question, Seminar, Session, Vote } from './types'

class Database extends Dexie {
  cycle: Dexie.Table<Cycle, string>
  session: Dexie.Table<Session, string>
  seminars: Dexie.Table<Seminar, string>
  questions: Dexie.Table<Question, string>
  vote: Dexie.Table<Vote, string>

  constructor(dbName: string) {
    super(dbName)

    this.version(3).stores({
      cycle: 'id, period, ends_at',
      session: 'id, token',
      seminars:
        'id, title, description, course, number_of_votes, voted_by_user',
      questions: 'id,text,options',
      vote: 'id, seminar_id, cycle_id'
    })

    this.cycle = this.table('cycle')
    this.session = this.table('session')
    this.seminars = this.table('seminars')
    this.questions = this.table('questions')
    this.vote = this.table('vote')
  }

  seminarsSubscription = liveQuery(() => this.seminars.orderBy(':id').toArray())
}

export const db = new Database('localdb')
