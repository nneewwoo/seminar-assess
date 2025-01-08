import type { RandomReader } from '@oslojs/crypto/random'

export const random: RandomReader = {
  read(bytes: Uint8Array): void {
    crypto.getRandomValues(bytes)
  }
}
