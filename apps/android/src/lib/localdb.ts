import Dexie, { liveQuery } from 'dexie'
import type {
  Answer,
  Cycle,
  Evaluation,
  EvaluationAnswer,
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
  answers: Dexie.Table<Answer, string>
  evaluations: Dexie.Table<Evaluation, string>
  evaluationAnswers: Dexie.Table<EvaluationAnswer, string>

  constructor(dbName: string) {
    super(dbName)

    this.version(10).stores({
      cycle: 'id, period, starts_at, ends_at',
      session: 'id, token',
      seminars:
        'id, title, description, course, number_of_votes, voted_by_user',
      questions: 'id, text, seminar_id, options',
      votes: 'id, seminar_id, cycle_id, rank, synced, seminar',
      participation: 'id, voted, answered_pre, answered_post, attended',
      answers: 'id, question_id, option_id, for, synced',
      evaluations: 'id, title, description, type, questions',
      evaluationAnswers: 'id, text, evaluation_id, question_id, answer, synced'
    })

    this.cycle = this.table('cycle')
    this.session = this.table('session')
    this.seminars = this.table('seminars')
    this.questions = this.table('questions')
    this.votes = this.table('votes')
    this.participation = this.table('participation')
    this.answers = this.table('answers')
    this.evaluations = this.table('evaluations')
    this.evaluationAnswers = this.table('evaluationAnswers')
  }

  seminarsSubscription = liveQuery(() => this.seminars.orderBy(':id').toArray())
}

export const db = new Database('localdb')
