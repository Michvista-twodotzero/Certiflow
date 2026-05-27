import { writable, derived } from 'svelte/store'
import { browser } from '$app/environment'

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

export function playNotificationPing() {
  if (!browser) return

  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextCtor) return

  const context = new AudioContextCtor()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(880, context.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(660, context.currentTime + 0.18)

  gain.gain.setValueAtTime(0.0001, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22)

  oscillator.connect(gain)
  gain.connect(context.destination)

  oscillator.start()
  oscillator.stop(context.currentTime + 0.24)
  oscillator.onended = () => {
    context.close().catch(() => {})
  }
}
