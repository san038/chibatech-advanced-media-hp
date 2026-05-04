import { joinURL } from 'ufo'

/** `public/` 以下のパスに app.baseURL を付与（GitHub Pages のサブパス配信用） */
export function usePublicPath() {
  const config = useRuntimeConfig()
  return (path: string) => {
    const normalized = path.replace(/^\//, '')
    return joinURL(config.app.baseURL, normalized)
  }
}
