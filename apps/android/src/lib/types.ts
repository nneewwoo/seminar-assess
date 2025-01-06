export type Option<T> = T | null | undefined

export type Period =
  | 'IDLE'
  | 'VOTING'
  | 'PRE_TEST'
  | 'SEMINAR'
  | 'POST_TEST'
  | 'EVALUATION'

export interface Cycle {
  id: string
  period: Period
  endsAt: Date
}

export interface Session {
  id: string
  token: string
}

export interface Course {
  id: string
  name: string
}

export interface Seminar {
  id: string
  title: string
  description: string
  course: Course
  numberOfVotes: number
  votedByUser: boolean
}

export interface Vote {
  id: string
  seminarId: string
  cycleId: string
  synced: boolean
}

export interface QuestionOption {
  id: string
  label: string
}

export interface Question {
  id: string
  text: string
  options: QuestionOption[]
}

export interface Participation {
  id: string
  voted: boolean
  answeredPre: boolean
  answeredPost: boolean
  attended: boolean
}
