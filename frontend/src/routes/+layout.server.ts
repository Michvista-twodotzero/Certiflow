import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async () => {
  return {
    apiBaseUrl: (process.env.PUBLIC_API_BASE_URL || 'http://localhost:3000/api').replace(/\/$/, ''),
  }
}

