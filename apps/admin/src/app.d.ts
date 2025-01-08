import type { Session, User } from '@seminar-assess/db'

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: User | null
      session: Session | null
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}
