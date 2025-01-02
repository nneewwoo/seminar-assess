export type Course = {
  id: string
  name: string
}

export type User = {
  id: string
  name: string
  email: string
  password?: string
  givenName: string
  familyName: string
  role: 'ADMIN' | 'USER'
}

export type Seminar = {
  id: string
  title: string
  description: string
  course: Course
}

export type Cycle = {
  id: string
  period: string
}
