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
  startsAt: Date
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
}

export interface Vote {
  id: string
  seminarId: string
  cycleId: string
  rank: number
  synced: boolean
  seminar: Seminar
}

export interface QuestionOption {
  id: string
  label: string
  isCorrect: boolean
}

export interface Question {
  id: string
  text: string
  seminarId: Seminar['id']
  options: QuestionOption[]
}

export interface Answer {
  id: string
  questionId: Question['id']
  optionId: QuestionOption['id']
  for: 'PRE_TEST' | 'POST_TEST'
  synced: boolean
}

export interface Participation {
  id: string
  voted: boolean
  answeredPre: boolean
  answeredPost: boolean
  attended: boolean
}

export interface EvaluationQuestion {
  id: string
  text: string
}

export interface Evaluation {
  id: string
  title: string
  description: string
  type: 'RATING' | 'FEEDBACK'
  questions: EvaluationQuestion[]
}

export interface EvaluationAnswer {
  id: string
  text: EvaluationQuestion['text']
  evaluationId: Evaluation['id']
  questionId: EvaluationQuestion['id']
  answer: string
  synced: boolean
  type: Evaluation['type']
}
