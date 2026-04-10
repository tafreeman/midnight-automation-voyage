<!--
  CodeSwitcher.vue — Multi-language code example tab switcher.
  DEV_REFERENCE must-have: language-aware code block tabs.
  
  Usage in markdown:
  <CodeSwitcher :tabs="['bash', 'powershell']" :code="['pnpm install', 'npm install']" />
-->
<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  tabs: string[];
  code: string[];
}>();

const activeTab = ref(0);

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
</script>

<template>
  <div class="code-switcher">
    <div class="tabs">
      <button
        v-for="(tab, index) in props.tabs"
        :key="tab"
        :class="['tab-btn', { active: activeTab === index }]"
        @click="activeTab = index"
      >
        {{ tab }}
      </button>
    </div>
    <div
      v-for="(block, index) in props.code"
      :key="index"
      v-show="activeTab === index"
      style="position: relative;"
    >
      <div class="language-bash vp-adaptive-theme">
        <button
          class="copy"
          title="Copy code"
          @click="copyToClipboard(block)"
        ></button>
        <span class="lang">{{ props.tabs[index] }}</span>
        <pre><code>{{ block }}</code></pre>
      </div>
    </div>
  </div>
</template>
