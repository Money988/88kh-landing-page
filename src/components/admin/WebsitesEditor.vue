<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/admin/api'
import type { WebsiteContent } from '@/data/fallback'

interface EditableWebsite {
  id: number | null
  key: string
  url: string
  icon: string
  nameKeys: string
  thumbnail: string
  thumbnailMobile: string
  sortOrder: number
}

const websites = ref<EditableWebsite[]>([])
const message = ref('')
const error = ref('')

const toEditable = (w: WebsiteContent): EditableWebsite => ({
  id: w.id,
  key: w.key,
  url: w.url,
  icon: w.icon,
  nameKeys: w.nameKeys.join(', '),
  thumbnail: w.thumbnail.join('\n'),
  thumbnailMobile: w.thumbnailMobile.join('\n'),
  sortOrder: w.sortOrder,
})

const splitLines = (value: string) =>
  value.split('\n').map((s) => s.trim()).filter(Boolean)

const toPayload = (w: EditableWebsite) => ({
  key: w.key.trim(),
  url: w.url.trim(),
  icon: w.icon,
  nameKeys: w.nameKeys.split(',').map((s) => s.trim()).filter(Boolean),
  thumbnail: splitLines(w.thumbnail),
  thumbnailMobile: splitLines(w.thumbnailMobile),
  sortOrder: Number(w.sortOrder) || 0,
})

const load = async () => {
  websites.value = (await api<WebsiteContent[]>('/api/admin/websites')).map(toEditable)
}

const flash = (msg: string) => {
  message.value = msg
  error.value = ''
  setTimeout(() => (message.value = ''), 2500)
}

const save = async (site: EditableWebsite) => {
  try {
    if (site.id === null) {
      await api('/api/admin/websites', { method: 'POST', body: toPayload(site) })
    } else {
      await api(`/api/admin/websites/${site.id}`, { method: 'PUT', body: toPayload(site) })
    }
    await load()
    flash('Saved')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Save failed'
  }
}

const remove = async (site: EditableWebsite) => {
  if (site.id === null) {
    websites.value = websites.value.filter((w) => w !== site)
    return
  }
  if (!confirm(`Delete website "${site.key}"?`)) return
  await api(`/api/admin/websites/${site.id}`, { method: 'DELETE' })
  await load()
  flash('Deleted')
}

const addNew = () => {
  websites.value.push({
    id: null,
    key: '',
    url: '',
    icon: '',
    nameKeys: '',
    thumbnail: '',
    thumbnailMobile: '',
    sortOrder: websites.value.length,
  })
}

onMounted(load)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-white">Websites</h2>
      <div class="flex items-center gap-3">
        <span v-if="message" class="text-sm text-green-400">{{ message }}</span>
        <span v-if="error" class="text-sm text-red-400">{{ error }}</span>
        <button class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500" @click="addNew">
          + Add website
        </button>
      </div>
    </div>

    <div
      v-for="site in websites"
      :key="site.id ?? 'new'"
      class="rounded-2xl border border-white/10 bg-slate-950/60 p-5"
    >
      <div class="grid gap-4 md:grid-cols-2">
        <label class="block text-sm">
          <span class="mb-1 block text-slate-400">Key (used for tagline translation `sites.&lt;key&gt;`)</span>
          <input v-model="site.key" class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-red-400/60" />
        </label>
        <label class="block text-sm">
          <span class="mb-1 block text-slate-400">URL</span>
          <input v-model="site.url" class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-red-400/60" />
        </label>
        <label class="block text-sm">
          <span class="mb-1 block text-slate-400">Icon (emoji)</span>
          <input v-model="site.icon" class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-red-400/60" />
        </label>
        <label class="block text-sm">
          <span class="mb-1 block text-slate-400">Name translation keys (comma separated, joined with " & ")</span>
          <input v-model="site.nameKeys" class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-red-400/60" />
        </label>
        <label class="block text-sm">
          <span class="mb-1 block text-slate-400">Desktop thumbnails (one URL per line)</span>
          <textarea v-model="site.thumbnail" rows="4" class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-red-400/60"></textarea>
        </label>
        <label class="block text-sm">
          <span class="mb-1 block text-slate-400">Mobile thumbnails (one URL per line)</span>
          <textarea v-model="site.thumbnailMobile" rows="4" class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-red-400/60"></textarea>
        </label>
        <label class="block text-sm">
          <span class="mb-1 block text-slate-400">Sort order</span>
          <input v-model.number="site.sortOrder" type="number" class="w-32 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-red-400/60" />
        </label>
      </div>
      <div class="mt-4 flex gap-2">
        <button class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500" @click="save(site)">
          Save
        </button>
        <button class="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:border-red-400/40 hover:text-white" @click="remove(site)">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
