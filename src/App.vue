<template>
  <PreviewPasswordGate>
    <div class="layout">
      <AppHeader />
      <main class="layout__main">
        <RouterView v-slot="{ Component }">
          <component :is="Component" />
        </RouterView>
      </main>
      <AppFooter />
    </div>
  </PreviewPasswordGate>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__main {
  flex: 1;
}
</style>
