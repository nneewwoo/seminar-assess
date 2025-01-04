import Dexie from 'dexie'
import type { Cycle, Session } from './types'

class Database extends Dexie {
  cycle: Dexie.Table<Cycle, string>
  session: Dexie.Table<Session, string>

  constructor(dbName: string) {
    super(dbName)

    this.version(1).stores({
      cycle: 'id, period',
      session: 'id, token'
    })

    this.cycle = this.table('cycle')
    this.session = this.table('session')
  }
}

export const db = new Database('localdb')
