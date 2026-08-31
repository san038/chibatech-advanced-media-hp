// Nuxt の useRuntimeConfig の最小互換。app.baseURL のみ提供。
export function useRuntimeConfig() {
  return {
    app: {
      baseURL: import.meta.env.BASE_URL || "/",
    },
  };
}
