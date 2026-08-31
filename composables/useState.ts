import { ref, type Ref } from "vue";

// Nuxt の useState 相当。key 単位でアプリ全体に共有される reactive 値。
const registry = new Map<string, Ref<unknown>>();

export function useState<T>(key: string, init?: () => T): Ref<T> {
  let state = registry.get(key) as Ref<T> | undefined;
  if (!state) {
    state = ref(init ? init() : undefined) as Ref<T>;
    registry.set(key, state as Ref<unknown>);
  }
  return state;
}
