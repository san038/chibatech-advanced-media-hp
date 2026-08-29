<template>
  <div class="top-page">
    <div class="hero-scrolly">
      <div class="hero-scrolly__stage">
        <HeroSection />
      </div>
      <CourseScrolly />
    </div>
    <NewsPreviewSection />
    <VisionSection />
    <ProjectPreviewSection />
    <LaboratoryPreviewSection />
    <CtaSection />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '知能メディア工学科 | 千葉工業大学',
  description:
    'まだないコミュニケーションを、つくる。音・AI・デザインで未来をひらく。千葉工業大学 知能メディア工学科。',
})
</script>

<style scoped>
.top-page {
  /* No additional styles needed - sections handle their own styling */
}

/* ヒーローを背面に固定し、その上をコース紹介テキストがスクロールしていく */
.hero-scrolly {
  position: relative;
}

.hero-scrolly__stage {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
  z-index: 0;
}

.hero-scrolly__stage :deep(.hero) {
  min-height: 100%;
  height: 100%;
}
</style>
