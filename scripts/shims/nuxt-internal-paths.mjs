// `#internal/nuxt/paths` の Node 解決用（package.json imports から参照）
export function baseURL() {
  const env = typeof process !== 'undefined' ? process.env : undefined
  return env?.NUXT_APP_BASE_URL ?? '/'
}

export function buildAssetsDir() {
  return '/_nuxt/'
}

export function buildAssetsURL(...path) {
  const tail = path.filter(Boolean).join('/').replace(/^\/+/, '')
  return tail ? `/_nuxt/${tail}` : '/_nuxt/'
}

export function publicAssetsURL(...path) {
  const tail = path.filter(Boolean).join('/').replace(/^\/+/, '')
  return tail ? `/${tail}` : '/'
}
