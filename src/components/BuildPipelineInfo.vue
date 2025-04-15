<script setup>
import { storeToRefs } from 'pinia';

import { useAppStore } from '@/stores/appStore.js';

const { buildNumber } = storeToRefs(useAppStore());
const { buildId } = defineProps({
  buildId: {
    type: Number,
    required: true,
  },
});

const buildLink = `https://github.com/dyaroman/wla-e2e/_build/results?buildId=${buildId}&view=results`;
</script>

<template>
  <section>
    <h4>
      Build:
      <a :href="buildLink" target="_blank" rel="noopener noreferrer"
        >#{{ buildNumber }}</a
      >
    </h4>
  </section>
</template>
