<script setup>
import { onMounted } from 'vue';

import TestResultsCategory from '@/components/TestResultsCategory.vue';

const props = defineProps({
  testResults: {
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

for (const testResult of props.testResults) {
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
  document.title = `[${failed.length}/${props.testResults.length}]: AQA`;
  updateFavicon(failed.length === 0);
});
</script>

<template>
  <TestResultsCategory category="fail" :test-results="failed" :build-number />
  <TestResultsCategory category="pass" :test-results="passed" />
  <TestResultsCategory category="skip" :test-results="skipped" />
</template>

<style scoped lang="scss"></style>
