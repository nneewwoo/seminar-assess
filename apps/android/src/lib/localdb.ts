import Dexie from 'dexie'
import type { Cycle } from './types'

class Database extends Dexie {
  cycle: Dexie.Table<Cycle, string>

  constructor(dbName: string) {
    super(dbName)

    this.version(1).stores({
      cycle: 'id, period'
    })

    this.cycle = this.table('cycle')
  }
}

export const db = new Database('localdb')
