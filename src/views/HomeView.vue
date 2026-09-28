<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Header from '@/components/Header.vue'
import ProductCard from '@/components/ProductCard.vue'
import type { SupportedLocale } from '@/i18n'
import LiveChatWidgetV2 from '@/components/LiveChatWidgetV2.vue'
import { useContent } from '@/composables/useContent'

const { locale, t } = useI18n()
const selectedLanguage = computed<SupportedLocale>(() => (locale.value as SupportedLocale) || 'en')

const { content } = useContent()

const websites = computed(() =>
  content.websites.map((site) => ({
    id: site.key,
    key: site.key,
    name: site.nameKeys.map((key) => t(key)).join(' & '),
    url: site.url,
    icon: site.icon,
    thumbnail: site.thumbnail,
    thumbnailMobile: site.thumbnailMobile,
  })),
)

const supportGroups = computed(() =>
  content.supportGroups.map((group) => ({
    title: t(group.titleKey),
    icon: group.icon,
    links: group.links.map((link) => ({
      key: link.key,
      handle: link.handleKey ? t(link.handleKey) : link.handle,
      url: link.url,
    })),
  })),
)

const setLanguage = (language: SupportedLocale) => {
  locale.value = language
}
</script>

<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 bg-no-repeat bg-cover bg-fixed scroll-smooth"
       style="
         background-image:
             linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
             url('https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/abstract-background.avif');
     "
  >
    <Header :selected-language-code="selectedLanguage" @language-change="setLanguage" />

    <main class="mx-auto container p-4 lg:p-6 pb-16 sm:px-6 lg:px-0">
      <div class="grid gap-3.5 lg:gap-7 md:grid-cols-2 xl:grid-cols-3 lg:pt-2">
        <ProductCard
          v-for="site in websites"
          :key="site.id"
          :site="site"
          :tagline="t(`sites.${site.key}`)"
          :play-now-label="t('cards.playNow')"
        />
      </div>

      <section id="contact-us" class="mt-4 lg:mt-10 rounded-2xl lg:rounded-2xl border border-gray-100/10 bg-gray-800/10 p-4 lg:p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)] backdrop-blur-md">
        <div class="grid gap-5 lg:gap-7 md:grid-cols-3">
          <div
            v-for="group in supportGroups"
            :key="group.title"
          >
            <div class="mb-3 lg:mb-4 flex items-center gap-2">
              <img class="size-7 lg:size-8 shrink-0" :src="group.icon" alt="">
              <h3 class="text-base lg:text-lg font-bold text-white">{{ group.title }}</h3>
            </div>

            <div class="space-y-3">
              <a
                v-for="link in group.links"
                :key="link.handle"
                :href="link.url"
                target="_blank"
                rel="noreferrer"
                class="group flex items-center justify-start gap-2 lg:gap-3 rounded-2xl border border-white/10 bg-gray-700/10 px-3 lg:px-4 py-3 transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/5 hover:shadow-[0_0_0_1px_rgba(248,113,113,0.15),0_8px_18px_rgba(239,68,68,0.12)]"
              >
                <div class="inline-flex items-center justify-center size-11 lg:size-12 rounded-full shrink-0 bg-white/10 text-blue-400 lg:group-hover:bg-white/20 lg:group-hover:text-white transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 animate-jiggle">
                    <path d="M21.9 3.2 18.7 20c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.2-8.3c.4-.4-.1-.6-.6-.2L6.1 13.6l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.6 3c.9-.3 1.7.2 1.3.2Z"></path>
                  </svg>
                </div>
                <div class="flex-1 flex flex-col gap-1.5">
                  <p class="mt-1 text-sm font-semibold text-white leading-none">{{ link.handle }}</p>
                  <p class="text-[11px] font-hanuman underline tracking-wide text-yellow-600">{{ t(`support.${link.key}`) }}</p>
                </div>
                <span class="size-8 lg:size-9 inline-flex items-center justify-center rounded-full transition-all group-hover:translate-x-1 border border-white/10 bg-slate-900/80">
                  <span class="text-lg text-red-200 -mt-1">→</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
      <LiveChatWidgetV2 />
    </main>
  </div>
</template>
