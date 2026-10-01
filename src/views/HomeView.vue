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

      <section
        id="contact-us"
        class="telegram-support-shell relative mt-4 overflow-hidden rounded-[20px] lg:rounded-3xl border border-[#92d6ff2e] bg-[rgba(8,26,61,0.36)] p-4 shadow-[0_28px_60px_rgba(7,14,30,0.42)] sm:p-5 lg:mt-10 lg:p-6"
      >
        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-3 flex-col gap-6">
          <div
            v-for="(group, groupIndex) in supportGroups"
            :key="group.title"
            class="flex flex-col gap-2 lg:gap-3"
          >
            <div
              class="inline-flex min-h-10 w-fit items-center gap-2 rounded-full text-white"
            >
              <img class="size-7 object-contain shrink-0" :src="group.icon" alt="" />
              <h3 class="m-0 text-lg font-extrabold leading-none lg:text-xl">{{ group.title }}</h3>
            </div>

            <div class="flex flex-col gap-3 lg:gap-3.5">
              <a
                v-for="link in group.links"
                :key="link.handle"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex w-full items-center gap-2 rounded-full border border-[#61bbffcc] bg-linear-to-b from-[#fafafff0] to-[#e7f0f9e0] p-2 text-slate-900 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6),0_14px_18px_rgba(17,101,184,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.65),0_18px_22px_rgba(17,101,184,0.2)] sm:gap-2.5 px-2.5 sm:px-2.5"
              >
                <span class="inline-flex size-10 lg:size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#26b6ff] via-[#0894df] to-[#0a7fe0] text-white shadow-[0_12px_18px_rgba(14,165,233,0.26)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-6 lg:size-7 animate-jiggle">
                    <path d="M21.9 3.2 18.7 20c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.2-8.3c.4-.4-.1-.6-.6-.2L6.1 13.6l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.6 3c.9-.3 1.7.2 1.3.2Z"/>
                  </svg>
                </span>
                <span class="min-w-0 flex-1">
                  <strong class="block overflow-hidden text-ellipsis whitespace-nowrap text-[15px] lg:text-base font-extrabold leading-tight tracking-[-0.04em] text-slate-900">{{ link.handle }}</strong>
                  <small class="mt-1 block text-[11px] leading-tight text-slate-700/70 underline underline-offset-2 sm:text-xs">{{ t(`support.${link.key}`) }}</small>
                </span>
                <span class="size-7 inline-flex justify-center items-center shrink-0 rounded-full bg-linear-to-br from-[#26c8ff] via-[#0d90ea] to-[#0f7ae2] transition-transform duration-200 group-hover:translate-x-0.5 shadow-[0_10px_18px_rgba(14,165,233,0.2)]">
                  <span class="text-[24px] -mt-1.25 leading-none text-white">→</span>
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
