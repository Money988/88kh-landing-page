<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SupportedLocale } from '@/i18n'

const languages = [
  { code: 'en', label: 'English', short: 'EN', flag: '/assets/flags/england-flag.png' },
  { code: 'km', label: 'Khmer', short: 'KH', flag: '/assets/flags/cambodia-flag.png' },
  { code: 'vn', label: 'Tiếng Việt', short: 'VN', flag: '/assets/flags/vietnam-flag.png' },
  { code: 'zh', label: '简体中文', short: 'CN', flag: '/assets/flags/china-flag.png' },
] as const

const props = defineProps<{ selectedLanguageCode: SupportedLocale }>()
const emit = defineEmits<{ (event: 'language-change', value: SupportedLocale): void }>()

const selectedLanguage = computed(
  () => languages.find((language) => language.code === props.selectedLanguageCode) ?? languages[0],
)

const selectLanguage = (language: (typeof languages)[number]) => {
  emit('language-change', language.code)
}

const goToContactUs = () => {
  const el = document.getElementById('contact-us')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <header class="bg-slate-900/60 backdrop-blur-sm">
    <div class="mx-auto container px-3 lg:px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between gap-3 py-2">
        <a href="/" class="flex items-center gap-3">
          <img
            src="/assets/88kh-animate.webp"
            alt="88KH logo"
            class="h-10 lg:h-14 drop-shadow-[0_0_18px_rgba(251,191,36,0.18)]"
          />
        </a>

        <div class="flex flex-1 items-center justify-end gap-2 lg:gap-3">
          <a
            href="https://t.me/Bet_988"
            target="_blank"
            rel="noreferrer"
            class="hidden lg:inline-flex animate-jiggle rounded-full size-9 transition hover:scale-105"
          >
            <img class="w-full h-full rounded-full object-cover" src="/assets/telegram-gradient.png" alt="Telegram" />
          </a>
          <a
              href="#contact-us"
              @click.prevent="goToContactUs"
              rel="noreferrer"
              class="block lg:hidden animate-jiggle rounded-full size-9 transition hover:scale-105"
          >
            <img class="w-full h-full rounded-full object-cover" src="/assets/telegram-gradient.png" alt="Telegram" />
          </a>

          <div class="w-px h-5 bg-slate-200/30"/>

          <div class="relative inline-flex gap-1.5 lg:gap-2">
            <button
                v-for="language in languages"
                :key="language.code"
                type="button"
                @click="selectLanguage(language)"
                :class="[
                  'inline-flex justify-center items-center gap-3 size-8 p-0.5 text-left rounded-full transition',
                  selectedLanguage.code === language.code
                    ? 'bg-red-500/10 text-red-100 border border-yellow-400'
                    : 'text-slate-200 hover:bg-white/5',
                ]"
            >
              <img :src="language.flag" :alt="language.label" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

