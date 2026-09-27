<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Header from '@/components/Header.vue'
import ProductCard from '@/components/ProductCard.vue'
import type { SupportedLocale } from '@/i18n'
import LiveChatWidgetV2 from "@/components/LiveChatWidgetV2.vue";

const { locale, t } = useI18n()
const selectedLanguage = computed<SupportedLocale>(() => (locale.value as SupportedLocale) || 'en')

const websites = computed(() => [
  {
    id: 'sportsbook',
    name: t('cards.sportsbook'),
    url: 'https://88bkh.com',
    icon: '⚽',
    thumbnailMobile: [
      'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/sportsbook/mobile/855-mockup.webp',
      'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/sportsbook/mobile/live-mockup.webp',
      'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/sportsbook/mobile/sbc-mockup.webp',
    ],
    thumbnail: [
        'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/sportsbook/855-mockup.webp',
        'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/sportsbook/live-mockup.webp',
        'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/sportsbook/sbc-mockup.webp',
    ],
    key: 'sportsbook',
  },
  {
    id: 'cockfight',
    name: t('cards.cockfight') + ' & ' + t('cards.casino'),
    url: 'https://88cf.live',
    icon: '🐓',
    thumbnailMobile: [
      'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/cockfight-and-casino/mobile/cockfight-mockup.webp',
        'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/cockfight-and-casino/mobile/baccarat-mockup.webp',
        'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/cockfight-and-casino/mobile/dragon-tiger-mockup.webp',
    ],
    thumbnail: [
        'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/cockfight-and-casino/88cockfight-mockup.webp',
        'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/cockfight-and-casino/baccarat-mockup.webp',
        'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/cockfight-and-casino/dragon-tiger-mockup.webp',
    ],
    key: 'cockfight',
  },
  {
    id: 'slot',
    name: t('cards.games'),
    url: 'https://88slot.live',
    icon: '🎰',
    thumbnailMobile: [
      'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/games/mobile/88slot-mockup.webp',
      'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/games/mobile/jili-mockup.webp',
      'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/games/mobile/joker-mockup.webp',
      'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/games/mobile/pg-mockup.webp',
      'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/games/mobile/pplay-mockup.webp',
    ],
    thumbnail: [
      'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/games/88slot-mockup.webp',
      'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/games/jili-mockup.webp',
      'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/games/joker-mockup.webp',
      'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/games/pg-mockup.webp',
      'https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/games/pplay-mockup.webp',
    ],
    key: 'slot',
  },
] as const)

const supportGroups = computed(() => [
  {
    title: t('support.accountTitle'),
    icon: '/assets/icons/register-user.png',
    links: [
      // { key: 'click_here_for_register', handle: '@Bet_988', url: 'https://t.me/Bet_988' },
      { key: 'click_here_for_register', handle: '@KH88Play_01', url: 'https://t.me/KH88Play_01' },
      { key: 'click_here_for_register', handle: '@KH88Play_02', url: 'https://t.me/KH88Play_02' },
      { key: 'click_here_for_register', handle: '@KH88Play_05', url: 'https://t.me/KH88Play_05' },
    ],
  },
  {
    title: t('support.bettingTitle'),
    icon: '/assets/icons/bet-now-icon.png',
    links: [
      { key: 'click_here_for_betting', handle: '88KH ឆ្នោត 01', url: 'https://t.me/KH88Play_03' },
      { key: 'click_here_for_betting', handle: '88KH ឆ្នោត 02', url: 'https://t.me/KH88Play_04' },
    ],
  },
  {
    title: t('support.otherIssuesTitle'),
    icon: '/assets/icons/question-help.png',
    links: [
      { key: 'click_here_for_feedback', handle: t('support.customerSupport'), url: 'https://t.me/Bet_988' },
    ],
  },
] as const)

const setLanguage = (language: SupportedLocale) => {
  locale.value = language
}
</script>

<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 bg-no-repeat bg-cover bg-fixed scroll-smooth"
       style="
         background-image:
             linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
             url('https://img.magnific.com/free-vector/abstract-background-with-pink-purple-flowing-lines-design_1048-20364.jpg?semt=ais_hybrid&w=740&q=80');
     "
  >
    <Header :selected-language-code="selectedLanguage" @language-change="setLanguage" />

    <main class="mx-auto container p-4 lg:p-6 pb-16 sm:px-6 lg:px-0">
      <div class="grid gap-4 lg:gap-7 md:grid-cols-2 xl:grid-cols-3 lg:pt-2">
        <ProductCard
          v-for="site in websites"
          :key="site.id"
          :site="site"
          :tagline="t(`sites.${site.key}`)"
          :play-now-label="t('cards.playNow')"
        />
      </div>

      <section id="contact-us" class="mt-4 lg:mt-10 rounded-2xl lg:rounded-4xl border border-white/10 bg-slate-950/60 p-5 lg:p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)] backdrop-blur-sm">
        <div class="grid gap-6 lg:gap-7 md:grid-cols-3">
          <div
            v-for="group in supportGroups"
            :key="group.title"
          >
            <div class="mb-3 lg:mb-4 flex items-center gap-2">
              <img class="size-8" :src="group.icon" alt="">
              <h3 class="text-base lg:text-lg font-bold text-white">{{ group.title }}</h3>
            </div>

            <div class="space-y-3">
              <a
                v-for="link in group.links"
                :key="link.handle"
                :href="link.url"
                target="_blank"
                rel="noreferrer"
                class="group flex items-center justify-start gap-2 lg:gap-3 rounded-2xl border border-white/10 bg-slate-900/55 px-3 lg:px-4 py-3 transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/5 hover:shadow-[0_0_0_1px_rgba(248,113,113,0.15),0_16px_30px_rgba(239,68,68,0.12)]"
              >
                <div class="inline-flex items-center justify-center size-11 lg:size-12 rounded-full shrink-0 bg-white/10 text-blue-500 lg:group-hover:bg-white/20 lg:group-hover:text-white transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 animate-jiggle">
                    <path d="M21.9 3.2 18.7 20c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.2-8.3c.4-.4-.1-.6-.6-.2L6.1 13.6l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.6 3c.9-.3 1.7.2 1.3.2Z"></path>
                  </svg>
                </div>
<!--                <img class="size-9" src="https://image-font.sgp1.cdn.digitaloceanspaces.com/88kh/telegram-animate.gif" alt="">-->
                <div class="flex-1 flex flex-col gap-1.5">
                  <p class="mt-1 text-sm font-semibold text-white leading-none">{{ link.handle }}</p>
                  <p class="text-[11px] font-hanuman underline tracking-wide text-yellow-600">{{ t(`support.${link.key}`) }}</p>
                </div>
                <span class="size-9 inline-flex items-center justify-center rounded-full transition-all group-hover:translate-x-1 border border-white/10 bg-slate-900/80">
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
