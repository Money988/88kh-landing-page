import { watch } from 'vue'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import km from './locales/km.json'
import vn from './locales/vn.json'
import zh from './locales/zh.json'

export type SupportedLocale = 'en' | 'km' | 'vn' | 'zh'

const getInitialLocale = (): SupportedLocale => {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const storedLocale = localStorage.getItem('locale')
  return storedLocale === 'en' || storedLocale === 'km' || storedLocale === 'vn' || storedLocale === 'zh'
    ? storedLocale
    : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    km,
    vn,
    zh,
  },
})

watch(
  () => i18n.global.locale.value,
  (nextLocale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', nextLocale)
    }
  },
  { immediate: true },
)
