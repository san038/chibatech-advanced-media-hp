<template>
  <div class="gate-root">
    <div v-if="!booted" class="gate gate--boot" aria-hidden="true" />
    <div v-else-if="!unlocked" class="gate gate--lock" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div class="gate__panel">
        <p id="gate-title" class="gate__title">プレビュー</p>
        <p class="gate__hint">パスワードを入力してください</p>
        <form class="gate__form" @submit.prevent="onSubmit">
          <label class="gate__label" for="gate-password">パスワード</label>
          <input
            id="gate-password"
            v-model="password"
            class="gate__input"
            type="password"
            name="password"
            autocomplete="current-password"
            autocapitalize="off"
            spellcheck="false"
          />
          <p v-if="error" class="gate__error" role="alert">パスワードが違います</p>
          <button type="submit" class="gate__submit">開く</button>
        </form>
      </div>
    </div>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
const STORAGE_KEY = 'chibatech-adm-hp-preview'
const PASSWORD = 'dev'

const booted = ref(false)
const unlocked = ref(false)
const password = ref('')
const error = ref(false)

onMounted(() => {
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === '1') {
      unlocked.value = true
    }
  } catch {
    /* sessionStorage unavailable */
  }
  booted.value = true
})

function onSubmit() {
  error.value = false
  if (password.value === PASSWORD) {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    unlocked.value = true
    return
  }
  error.value = true
}
</script>

<style scoped>
.gate-root {
  min-height: 100vh;
}

.gate {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
}

.gate--boot {
  cursor: wait;
}

.gate__panel {
  width: min(22rem, calc(100vw - 2rem));
  padding: var(--space-md);
  background: var(--color-surface-lowest);
  border: 1px solid var(--color-on-surface-faint);
  font-family: var(--font-body);
}

.gate__title {
  margin: 0 0 var(--space-xs);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-on-surface);
}

.gate__hint {
  margin: 0 0 var(--space-sm);
  font-size: var(--text-sm);
  color: var(--color-on-surface-muted);
}

.gate__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.gate__label {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-on-surface-muted);
}

.gate__input {
  width: 100%;
  padding: 0.65rem 0.75rem;
  font: inherit;
  font-size: var(--text-base);
  color: var(--color-on-surface);
  background: var(--color-bg);
  border: 1px solid var(--color-on-surface-faint);
  border-radius: var(--border-radius);
}

.gate__input:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.gate__error {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-media);
}

.gate__submit {
  margin-top: var(--space-xs);
  padding: 0.65rem 1rem;
  font: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-on-primary);
  background: var(--color-primary);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.gate__submit:hover {
  filter: brightness(1.05);
}

.gate__submit:focus-visible {
  outline: 2px solid var(--color-on-surface);
  outline-offset: 2px;
}
</style>
