import { useEffect, useState } from 'react'

const API_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '')
export const websiteApi = path => `${API_URL}/api/website/${path}`
export const imageUrl = (page, code, metadata) => {
  const revision = metadata?.updated_at || metadata?.created_at
  return `${websiteApi(`page-images/${encodeURIComponent(page)}/${encodeURIComponent(code)}`)}${revision ? `?v=${encodeURIComponent(revision)}` : ''}`
}
export const safeUrl = url => typeof url === 'string' && /^(\/(?!\/)|https?:\/\/)[^\s\\]*$/i.test(url)

export function useWebsitePage(page, title) {
  const [state, setState] = useState({ loading: true, error: false, rows: [], images: {} })
  useEffect(() => {
    const controller = new AbortController()
    let imageRequest = 0
    async function read(path) {
      const response = await fetch(websiteApi(path), { signal: controller.signal, cache: 'no-store' })
      const result = await response.json()
      const rows = Array.isArray(result) ? result : Array.isArray(result.data) ? result.data : result.data?.data
      if (!response.ok || result.success === false || !Array.isArray(rows)) throw new Error('Unavailable')
      return rows.filter(row => row.is_active !== false && row.is_active !== 0)
    }
    const initialImageRequest = ++imageRequest
    Promise.allSettled([read(`page-content/${page}`), read(`page-images/${page}`)]).then(([content, images]) => {
      if (controller.signal.aborted) return
      setState(previous => ({ loading: false, error: content.status === 'rejected', rows: content.status === 'fulfilled' ? content.value : [], images: initialImageRequest === imageRequest ? Object.fromEntries((images.status === 'fulfilled' ? images.value : []).map(row => [row.section_code, row])) : previous.images }))
    })
    const refreshImages = () => {
      if (document.visibilityState === 'hidden') return
      const requestNumber = ++imageRequest
      read(`page-images/${page}`).then(images => {
        if (!controller.signal.aborted && requestNumber === imageRequest) setState(previous => ({ ...previous, images: Object.fromEntries(images.map(row => [row.section_code, row])) }))
      }).catch(() => {})
    }
    const onStorage = event => { if (event.key === 'website-image-revision') refreshImages() }
    window.addEventListener('focus', refreshImages)
    window.addEventListener('storage', onStorage)
    window.addEventListener('website-images-changed', refreshImages)
    document.addEventListener('visibilitychange', refreshImages)
    const interval = window.setInterval(refreshImages, 30000)
    const previous = document.title
    document.title = `${title} | Sivaraj Group`
    return () => {
      controller.abort(); document.title = previous
      window.clearInterval(interval)
      window.removeEventListener('focus', refreshImages)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('website-images-changed', refreshImages)
      document.removeEventListener('visibilitychange', refreshImages)
    }
  }, [page, title])
  const lookup = Object.fromEntries(state.rows.map(row => [row.section_code, row]))
  return { ...state, page, lookup, get: (code, fallback, aliases = []) => lookup[code] || aliases.map(alias => lookup[alias]).find(Boolean) || fallback }
}
