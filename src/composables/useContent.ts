import { reactive, readonly } from 'vue'
import { i18n } from '@/i18n'
import {
  fallbackWebsites,
  fallbackSupportGroups,
  type WebsiteContent,
  type SupportGroup,
} from '@/data/fallback'

interface ContentState {
  websites: WebsiteContent[]
  supportGroups: SupportGroup[]
  loaded: boolean
}

const state = reactive<ContentState>({
  websites: fallbackWebsites,
  supportGroups: fallbackSupportGroups,
  loaded: false,
})

let loadPromise: Promise<void> | null = null

const load = async () => {
  try {
    const res = await fetch('/api/content')
    if (!res.ok) return
    const data = await res.json()
    if (Array.isArray(data.websites) && data.websites.length) state.websites = data.websites
    if (Array.isArray(data.supportGroups) && data.supportGroups.length) state.supportGroups = data.supportGroups
    if (data.translations && typeof data.translations === 'object') {
      for (const [locale, messages] of Object.entries(data.translations)) {
        i18n.global.mergeLocaleMessage(locale, messages as Record<string, unknown>)
      }
    }
    state.loaded = true
  } catch {
    // Keep bundled fallback content when the API is unavailable
  }
}

export const useContent = () => {
  loadPromise ??= load()
  return { content: readonly(state), reload: load }
}
