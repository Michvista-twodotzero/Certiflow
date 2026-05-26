import { browser } from '$app/environment'
import { writable } from 'svelte/store'
import type { UserSettings } from '@certiflow/shared'

const STORAGE_KEY = 'certiflow-user-settings'

const DEFAULT_SETTINGS: UserSettings = {
  emailNotifications: true,
  criticalViolationAlerts: true,
  theme: 'dark',
}

function loadStoredSettings(): UserSettings {
  if (!browser) return DEFAULT_SETTINGS

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return DEFAULT_SETTINGS

  try {
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<UserSettings>) }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return DEFAULT_SETTINGS
  }
}

function createSettingsStore() {
  const { subscribe, set, update } = writable<UserSettings>(loadStoredSettings())

  return {
    subscribe,
    set(value: UserSettings) {
      persistSettings(value)
      set(value)
    },
    update(updater: (value: UserSettings) => UserSettings) {
      update((current) => {
        const next = updater(current)
        persistSettings(next)
        return next
      })
    },
    load() {
      const value = loadStoredSettings()
      set(value)
      applyTheme(value.theme)
      return value
    },
  }
}

function persistSettings(settings: UserSettings) {
  if (!browser) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  applyTheme(settings.theme)
}

export function applyTheme(theme: UserSettings['theme']) {
  if (!browser) return
  document.documentElement.dataset.theme = theme
}

export const userSettings = createSettingsStore()
