import { browser } from '$app/environment'
import { page } from '$app/stores'
import { get } from 'svelte/store'

const LOCAL_FALLBACK = 'http://localhost:3000/api'

export function getApiBaseUrl() {
  if (!browser) {
    return LOCAL_FALLBACK
  }

  const layoutBaseUrl = get(page).data?.apiBaseUrl as string | undefined
  const envBaseUrl = import.meta.env.PUBLIC_API_BASE_URL

  return (layoutBaseUrl || envBaseUrl || LOCAL_FALLBACK).replace(/\/$/, '')
}

