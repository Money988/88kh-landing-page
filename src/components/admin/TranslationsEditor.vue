<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { api } from '@/admin/api'

interface TranslationRow {
  locale: string
  path: string
  value: string
}

const rows = ref<TranslationRow[]>([])
const activeLocale = ref('en')
const filter = ref('')
const message = ref('')
const error = ref('')
const newPath = ref('')
const newValue = ref('')

const locales = computed(() => {
  const set = new Set(rows.value.map((r) => r.locale))
  return [...set].sort()
})

const visibleRows = computed(() =>
  rows.value.filter(
    (r) =>
      r.locale === activeLocale.value &&
      (!filter.value ||
        r.path.toLowerCase().includes(filter.value.toLowerCase()) ||
        r.value.toLowerCase().includes(filter.value.toLowerCase())),
  ),
)

const load = async () => {
  rows.value = await api<TranslationRow[]>('/api/admin/translations')
}

const flash = (msg: string) => {
  message.value = msg
  error.value = ''
  setTimeout(() => (message.value = ''), 2500)
}

const save = async (row: TranslationRow) => {
  try {
    await api('/api/admin/translations', { method: 'PUT', body: row })
    flash(`Saved ${row.path}`)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Save failed'
  }
}

const remove = async (row: TranslationRow) => {
  if (!confirm(`Delete "${row.path}" (${row.locale})?`)) return
  try {
    await api('/api/admin/translations', {
      method: 'DELETE',
      body: { locale: row.locale, path: row.path },
    })
    await load()
    flash('Deleted')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Delete failed'
  }
}

const addNew = async () => {
  if (!newPath.value.trim()) return
  try {
    await api('/api/admin/translations', {
      method: 'PUT',
      body: { locale: activeLocale.value, path: newPath.value.trim(), value: newValue.value },
    })
    newPath.value = ''
    newValue.value = ''
    await load()
    flash('Added')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Add failed'
  }
}

onMounted(load)
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-lg font-bold text-white">Translations</h2>
      <div class="flex items-center gap-3">
        <span v-if="message" class="text-sm text-green-400">{{ message }}</span>
        <span v-if="error" class="text-sm text-red-400">{{ error }}</span>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="locale in locales"
        :key="locale"
        class="rounded-lg px-3 py-1.5 text-sm font-semibold uppercase transition"
        :class="activeLocale === locale ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-300 hover:text-white'"
        @click="activeLocale = locale"
      >
        {{ locale }}
      </button>
      <input
        v-model="filter"
        placeholder="Filter by key or value…"
        class="ml-auto w-64 rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-sm text-white outline-none focus:border-red-400/60"
      />
    </div>

    <div class="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <div class="mb-4 flex flex-wrap items-end gap-2 border-b border-white/5 pb-4">
        <label class="block text-xs">
          <span class="mb-1 block text-slate-400">New key (dot notation, e.g. cards.newKey)</span>
          <input v-model="newPath" class="w-64 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-red-400/60" />
        </label>
        <label class="block text-xs">
          <span class="mb-1 block text-slate-400">Value ({{ activeLocale }})</span>
          <input v-model="newValue" class="w-64 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-red-400/60" />
        </label>
        <button class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500" @click="addNew">
          + Add
        </button>
      </div>

      <div class="space-y-2">
        <div
          v-for="row in visibleRows"
          :key="`${row.locale}:${row.path}`"
          class="flex flex-wrap items-center gap-2"
        >
          <code class="w-64 shrink-0 truncate text-xs text-slate-400" :title="row.path">{{ row.path }}</code>
          <input
            v-model="row.value"
            class="min-w-48 flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-sm text-white outline-none focus:border-red-400/60"
            @keydown.enter="save(row)"
          />
          <button class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500" @click="save(row)">Save</button>
          <button class="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:border-red-400/40 hover:text-white" @click="remove(row)">✕</button>
        </div>
        <p v-if="!visibleRows.length" class="py-6 text-center text-sm text-slate-500">No translations match.</p>
      </div>
    </div>
  </div>
</template>
