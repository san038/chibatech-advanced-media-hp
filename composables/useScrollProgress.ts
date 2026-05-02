import { ref, onMounted, onUnmounted } from 'vue'

export const useScrollProgress = () => {
  const scrollY = ref(0)
  const scrollProgress = ref(0)
  const documentHeight = ref(0)
  const viewportHeight = ref(0)

  const updateScroll = () => {
    scrollY.value = window.scrollY
    documentHeight.value = document.documentElement.scrollHeight
    viewportHeight.value = window.innerHeight

    const maxScroll = documentHeight.value - viewportHeight.value
    scrollProgress.value = maxScroll > 0 ? Math.min(1, scrollY.value / maxScroll) : 0
  }

  onMounted(() => {
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateScroll)
    window.removeEventListener('resize', updateScroll)
  })

  /**
   * Get scroll progress within a specific element.
   * Returns 0 when element top is at viewport bottom, 1 when element bottom is at viewport top.
   */
  const getElementProgress = (el: HTMLElement | null): number => {
    if (!el) return 0

    const rect = el.getBoundingClientRect()
    const vh = viewportHeight.value
    const elementHeight = rect.height

    // How far the element has scrolled through the viewport
    const start = vh // element enters from bottom
    const end = -elementHeight // element exits from top

    const current = rect.top
    const progress = (start - current) / (start - end)

    return Math.max(0, Math.min(1, progress))
  }

  /**
   * Get scroll progress within a section by its offset from document top.
   * Useful for sticky scroll sections.
   */
  const getSectionProgress = (sectionTop: number, sectionHeight: number): number => {
    const vh = viewportHeight.value
    const relativeScroll = scrollY.value - sectionTop + vh
    const totalScrollable = sectionHeight

    if (totalScrollable <= 0) return 0
    return Math.max(0, Math.min(1, relativeScroll / totalScrollable))
  }

  return {
    scrollY,
    scrollProgress,
    documentHeight,
    viewportHeight,
    getElementProgress,
    getSectionProgress,
  }
}
