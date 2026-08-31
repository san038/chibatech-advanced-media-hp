<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, type RouteLocationRaw } from "vue-router";

const props = defineProps<{ to: RouteLocationRaw }>();
defineOptions({ inheritAttrs: false });

const isExternal = computed(
  () =>
    typeof props.to === "string" &&
    /^(https?:|mailto:|tel:|\/\/)/.test(props.to),
);
</script>

<template>
  <a v-if="isExternal" :href="(to as string)" v-bind="$attrs">
    <slot />
  </a>
  <RouterLink v-else :to="to" v-bind="$attrs">
    <slot />
  </RouterLink>
</template>
