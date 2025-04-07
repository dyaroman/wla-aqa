<script setup>
import { onMounted } from 'vue';

import TestsResultsList from '@/components/TestsResultsList.vue';

const props = defineProps({
  testsResults: {
    type: Array,
    required: true,
  },
  buildNumber: {
    type: String,
    required: true,
  },
});

const passed = [];
const failed = [];
const skipped = [];

for (const testResult of props.testsResults) {
  if (testResult.pass) {
    passed.push(testResult);
  } else if (testResult.fail) {
    failed.push(testResult);
  } else if (testResult.skipped) {
    skipped.push(testResult);
  }
}

function updateFavicon(isGreen) {
  const link =
    document.querySelector('link[rel*=icon]') || document.createElement('link');
  link.rel = 'icon';
  link.href = isGreen ? '/green.ico' : '/red.ico';
  document.head.appendChild(link);
}

onMounted(() => {
  document.title = `[${failed.length}/${props.testsResults.length}]: AQA`;
  updateFavicon(failed.length === 0);
});
</script>

<template>
  <TestsResultsList type="fail" :tests-results="failed" :build-number />
  <TestsResultsList type="pass" :tests-results="passed" />
  <TestsResultsList type="skip" :tests-results="skipped" />
</template>

<style scoped lang="scss"></style>
