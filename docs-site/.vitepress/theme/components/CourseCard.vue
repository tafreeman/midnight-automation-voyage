<!--
  CourseCard.vue — Reusable course card component for the catalog.
  Used in markdown via <CourseCard title="..." level="beginner" ... />
-->
<script setup lang="ts">
defineProps<{
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  modules: number;
  status: string;
  description: string;
  link: string;
  moduleList?: string[];
}>();
</script>

<template>
  <a :href="link" class="course-card" style="display: block; text-decoration: none; color: inherit;">
    <div class="course-title">{{ title }}</div>
    <div class="course-meta">
      <span :class="['course-badge', `badge-${level}`]">
        {{ level.charAt(0).toUpperCase() + level.slice(1) }}
      </span>
      <span class="course-badge" style="background: var(--vp-c-bg-soft); color: var(--mav-text-muted);">
        {{ modules }} modules
      </span>
      <span class="course-badge" style="background: var(--vp-c-bg-soft); color: var(--mav-text-muted);">
        {{ status }}
      </span>
    </div>
    <div class="course-description">{{ description }}</div>
    <div v-if="moduleList && moduleList.length" class="course-modules">
      <ul class="module-list">
        <li v-for="mod in moduleList" :key="mod">{{ mod }}</li>
      </ul>
    </div>
  </a>
</template>
