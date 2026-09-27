<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import 'vue3-carousel/carousel.css'
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'

type ProductSite = {
  id: string
  name: string
  url: string
  icon: string
  thumbnail: readonly string[]
  thumbnailMobile: readonly string[]
  key: string
}

const props = defineProps<{
  site: ProductSite
  tagline: string
  playNowLabel: string
}>()

const isMobile = ref(false)

const updateMobileState = () => {
  isMobile.value = window.innerWidth < 768
}
const slideCount = computed(() => props.site.thumbnail.length)
const autoplayDelay = computed(() => {
  if (slideCount.value <= 1) return 0
  return 3500 + Math.floor(Math.random() * 2500)
})

onMounted(() => {
  updateMobileState()
  window.addEventListener('resize', updateMobileState)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateMobileState)
})

const currentSlides = computed(() => {
  return isMobile.value && props.site.thumbnailMobile?.length
      ? props.site.thumbnailMobile
      : props.site.thumbnail
})
</script>

<template>
  <a
    :href="site.url"
    target="_blank"
    rel="noreferrer"
    class="group relative block overflow-hidden rounded-2xl bg-slate-900/80 p-px transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_30px_80px_rgba(15,23,42,0.75)]"
  >
    <div class="card-gradient-border" />
    <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-sm shadow-[0_18px_55px_rgba(15,23,42,0.38)] transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_25px_65px_rgba(15,23,42,0.55)]">
      <div class="relative overflow-hidden bg-slate-950">
        <Carousel
          :items-to-show="1"
          :wrap-around="slideCount > 1"
          :autoplay="autoplayDelay"
          :pause-autoplay-on-hover="true"
          :mouse-drag="slideCount > 1"
          :touch-drag="slideCount > 1"
          snap-align="start"
          class="product-card-carousel"
        >
          <Slide
            v-for="(image, index) in currentSlides"
            :key="image"
            :index="index"
          >
            <img
              :src="image"
              :alt="`${site.name} preview`"
              class="h-full w-full object-cover object-top"
              loading="lazy"
            >
          </Slide>

          <template v-if="slideCount > 1" #addons>
            <Pagination />
          </template>
        </Carousel>

        <div class="pointer-events-none absolute left-1/2 top-2 lg:top-3.5 z-10 w-full max-w-[90%] -translate-x-1/2 text-center">
          <div class="flex items-center gap-2">
            <div class="h-px flex-1 bg-linear-to-l from-red-400/50 to-transparent" />
            <p class="text-[17px] lg:text-lg font-bold uppercase">
              <span class="text-red-400">88KH</span>
              <span class="ml-1">{{ site.name }}</span>
            </p>
            <div class="h-px flex-1 bg-linear-to-r from-red-400/50 to-transparent" />
          </div>
        </div>

        <div class="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-2 lg:pb-3">
          <span class="play-button-shell transition-all group-hover:-translate-y-0.5 group-hover:scale-[1.04]">
            <span class="relative inline-flex items-center gap-2 rounded-full border border-red-300/70 bg-linear-to-r from-red-600 via-red-500 to-red-400 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_2px_4px_rgba(239,68,68,0.45)] transition-all duration-300">
              {{ playNowLabel }}
              <span class="inline-flex size-5 items-center justify-center rounded-full border border-white/30 bg-white/15 duration-300 group-hover:translate-x-1">
                <span aria-hidden="true" class="text-base leading-none text-white -mt-1">→</span>
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  </a>
</template>
