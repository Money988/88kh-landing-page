<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/admin/api'
import type { SupportGroup, SupportLink } from '@/data/fallback'

const groups = ref<SupportGroup[]>([])
const message = ref('')
const error = ref('')

const load = async () => {
  groups.value = await api<SupportGroup[]>('/api/admin/support-groups')
}

const flash = (msg: string) => {
  message.value = msg
  error.value = ''
  setTimeout(() => (message.value = ''), 2500)
}

const run = async (fn: () => Promise<unknown>, msg: string) => {
  try {
    await fn()
    await load()
    flash(msg)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Operation failed'
  }
}

const saveGroup = (group: SupportGroup) =>
  run(
    () =>
      api(`/api/admin/support-groups/${group.id}`, {
        method: 'PUT',
        body: { titleKey: group.titleKey, icon: group.icon, sortOrder: group.sortOrder },
      }),
    'Group saved',
  )

const addGroup = () =>
  run(
    () =>
      api('/api/admin/support-groups', {
        method: 'POST',
        body: { titleKey: 'support.newGroup', icon: '', sortOrder: groups.value.length },
      }),
    'Group added',
  )

const removeGroup = (group: SupportGroup) => {
  if (!confirm('Delete this group and all its links?')) return
  run(() => api(`/api/admin/support-groups/${group.id}`, { method: 'DELETE' }), 'Group deleted')
}

const saveLink = (link: SupportLink) =>
  run(
    () =>
      api(`/api/admin/support-links/${link.id}`, {
        method: 'PUT',
        body: {
          key: link.key,
          handle: link.handle,
          handleKey: link.handleKey || null,
          url: link.url,
          sortOrder: link.sortOrder,
        },
      }),
    'Link saved',
  )

const addLink = (group: SupportGroup) =>
  run(
    () =>
      api(`/api/admin/support-groups/${group.id}/links`, {
        method: 'POST',
        body: {
          key: 'click_here_for_register',
          handle: '@handle',
          url: 'https://t.me/',
          sortOrder: group.links.length,
        },
      }),
    'Link added',
  )

const removeLink = (link: SupportLink) => {
  if (!confirm('Delete this link?')) return
  run(() => api(`/api/admin/support-links/${link.id}`, { method: 'DELETE' }), 'Link deleted')
}

onMounted(load)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-white">Support Groups</h2>
      <div class="flex items-center gap-3">
        <span v-if="message" class="text-sm text-green-400">{{ message }}</span>
        <span v-if="error" class="text-sm text-red-400">{{ error }}</span>
        <button class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500" @click="addGroup">
          + Add group
        </button>
      </div>
    </div>

    <div
      v-for="group in groups"
      :key="group.id"
      class="rounded-2xl border border-white/10 bg-slate-950/60 p-5"
    >
      <div class="grid gap-4 md:grid-cols-3">
        <label class="block text-sm">
          <span class="mb-1 block text-slate-400">Title translation key</span>
          <input v-model="group.titleKey" class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-red-400/60" />
        </label>
        <label class="block text-sm">
          <span class="mb-1 block text-slate-400">Icon URL</span>
          <input v-model="group.icon" class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-red-400/60" />
        </label>
        <label class="block text-sm">
          <span class="mb-1 block text-slate-400">Sort order</span>
          <input v-model.number="group.sortOrder" type="number" class="w-32 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-red-400/60" />
        </label>
      </div>
      <div class="mt-3 flex gap-2">
        <button class="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-500" @click="saveGroup(group)">Save group</button>
        <button class="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-red-400/40 hover:text-white" @click="removeGroup(group)">Delete group</button>
        <button class="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-green-400/40 hover:text-white" @click="addLink(group)">+ Add link</button>
      </div>

      <div class="mt-4 space-y-3">
        <div
          v-for="link in group.links"
          :key="link.id"
          class="rounded-xl border border-white/5 bg-slate-900/50 p-4"
        >
          <div class="grid gap-3 md:grid-cols-5">
            <label class="block text-xs">
              <span class="mb-1 block text-slate-400">Label key (support.*)</span>
              <input v-model="link.key" class="w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-white outline-none focus:border-red-400/60" />
            </label>
            <label class="block text-xs">
              <span class="mb-1 block text-slate-400">Handle text</span>
              <input v-model="link.handle" class="w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-white outline-none focus:border-red-400/60" />
            </label>
            <label class="block text-xs">
              <span class="mb-1 block text-slate-400">Handle translation key (optional, overrides text)</span>
              <input :value="link.handleKey ?? ''" @input="link.handleKey = ($event.target as HTMLInputElement).value || null" class="w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-white outline-none focus:border-red-400/60" />
            </label>
            <label class="block text-xs">
              <span class="mb-1 block text-slate-400">URL</span>
              <input v-model="link.url" class="w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-white outline-none focus:border-red-400/60" />
            </label>
            <label class="block text-xs">
              <span class="mb-1 block text-slate-400">Sort order</span>
              <input v-model.number="link.sortOrder" type="number" class="w-24 rounded-lg border border-white/10 bg-slate-900 px-2 py-1.5 text-white outline-none focus:border-red-400/60" />
            </label>
          </div>
          <div class="mt-3 flex gap-2">
            <button class="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500" @click="saveLink(link)">Save link</button>
            <button class="rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-300 hover:border-red-400/40 hover:text-white" @click="removeLink(link)">Delete link</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
