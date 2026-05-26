import { writable, derived } from 'svelte/store'

export interface Notification {
  id: string
  message: string
  type: 'success' | 'info' | 'warning'
  timestamp: Date
  read: boolean
}

function createNotificationStore() {
  const { subscribe, update, set } = writable<Notification[]>([])

  return {
    subscribe,
    add(message: string, type: Notification['type'] = 'info') {
      const notification: Notification = {
        id: crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2),
        message,
        type,
        timestamp: new Date(),
        read: false,
      }

      update((items) => [notification, ...items].slice(0, 50))
    },
    markRead(id: string) {
      update((items) =>
        items.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    },
    markAllRead() {
      update((items) => items.map((n) => ({ ...n, read: true })))
    },
    clear() {
      set([])
    },
  }
}

export const notifications = createNotificationStore()

export const unreadCount = derived(notifications, ($n) =>
  $n.filter((n) => !n.read).length
)
