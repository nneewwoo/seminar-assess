export type Option<T> = T | null | undefined

export interface Cycle {
  id: string
  period: string
}

export interface Session {
  id: string
  token: string
}
