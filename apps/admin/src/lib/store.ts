import { writable } from 'svelte/store'

type Notification = {
  message: string
  type: 'success' | 'error' | 'info' | null
  show: boolean
}
export const notification = writable<Notification>({
  message: '',
  type: null,
  show: false
})

export const notify = (
  message: Notification['message'],
  type: Notification['type']
) => {
  notification.set({
    message,
    type,
    show: true
  })

  setTimeout(() => {
    notification.set({
      message: '',
      type: null,
      show: false
    })
  }, 3000)
}
