<!--
  FeatureGrid.vue — Responsive grid of feature items for the home page.
  Used in markdown: <FeatureGrid :items="[{icon, title, desc}]" />
-->
<script setup lang="ts">
defineProps<{
  items: Array<{
    icon: string;
    title: string;
    desc: string;
  }>;
}>();
</script>

<template>
  <div class="feature-grid">
    <div v-for="item in items" :key="item.title" class="feature-item">
      <div class="feature-icon">{{ item.icon }}</div>
      <div class="feature-title">{{ item.title }}</div>
      <div class="feature-desc">{{ item.desc }}</div>
    </div>
  </div>
</template>
