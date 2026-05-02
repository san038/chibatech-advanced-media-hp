<template>
  <div class="top-page">
    <HeroSection />
    <VisionSection />
    <CourseSection />
    <ProjectPreviewSection />
    <LaboratoryPreviewSection />
    <NewsPreviewSection />
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
</style>
