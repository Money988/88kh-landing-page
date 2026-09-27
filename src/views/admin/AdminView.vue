<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { clearToken } from '@/admin/api'
import WebsitesEditor from '@/components/admin/WebsitesEditor.vue'
import SupportEditor from '@/components/admin/SupportEditor.vue'
import TranslationsEditor from '@/components/admin/TranslationsEditor.vue'

const router = useRouter()
const tabs = [
  { id: 'websites', label: 'Websites' },
  { id: 'support', label: 'Support Groups' },
  { id: 'translations', label: 'Translations' },
] as const
const activeTab = ref<(typeof tabs)[number]['id']>('websites')

const logout = () => {
  clearToken()
  router.push({ name: 'admin-login' })
}
</script>

<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100">
    <header class="border-b border-white/10 bg-slate-950/70 backdrop-blur-sm">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <h1 class="text-lg font-bold text-white">88KH Back Office</h1>
        <div class="flex items-center gap-3">
          <a href="/" target="_blank" class="text-sm text-slate-300 hover:text-white">View site ↗</a>
          <button
            class="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-red-400/40 hover:text-white"
            @click="logout"
          >
            Log out
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6">
      <nav class="mb-6 flex gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="rounded-lg px-4 py-2 text-sm font-semibold transition"
          :class="activeTab === tab.id ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-300 hover:text-white'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </nav>

      <WebsitesEditor v-if="activeTab === 'websites'" />
      <SupportEditor v-else-if="activeTab === 'support'" />
      <TranslationsEditor v-else />
    </main>
  </div>
</template>
