<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/admin/api'

const router = useRouter()
const password = ref('')
const error = ref('')
const loading = ref(false)

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    await login(password.value)
    router.push({ name: 'admin' })
  } catch {
    error.value = 'Invalid password'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-4">
    <form
      class="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950/70 p-8 shadow-xl backdrop-blur-sm"
      @submit.prevent="submit"
    >
      <h1 class="mb-6 text-xl font-bold text-white">88KH Back Office</h1>
      <label class="mb-2 block text-sm text-slate-300" for="password">Admin password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        autocomplete="current-password"
        required
        class="mb-4 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-red-400/60"
      />
      <p v-if="error" class="mb-4 text-sm text-red-400">{{ error }}</p>
      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
      >
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>
  </div>
</template>
