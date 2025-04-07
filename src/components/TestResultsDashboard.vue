<script setup>
import { computed, onMounted } from 'vue';

import TestResultsCategory from '@/TestResultsCategory.vue';

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

const passed = computed(() => props.testResults.filter((test) => test.pass));
const failed = computed(() => props.testResults.filter((test) => test.fail));
const skipped = computed(() =>
  props.testResults.filter((test) => test.skipped),
);

const documentTitle = computed(
  () => `[${failed.value.length}/${props.testResults.length}]: AQA`,
);
const shouldShowGreenFavicon = computed(() => failed.value.length === 0);

function updateFavicon(isGreen) {
  const link =
    document.querySelector('link[rel*=icon]') || document.createElement('link');
  link.rel = 'icon';
  link.href = isGreen ? '/green.ico' : '/red.ico';
  document.head.appendChild(link);
}

onMounted(() => {
  document.title = documentTitle.value;
  updateFavicon(shouldShowGreenFavicon.value);
});
</script>

<template>
  <TestResultsCategory category="fail" :test-results="failed" :build-number />
  <TestResultsCategory category="pass" :test-results="passed" />
  <TestResultsCategory category="skip" :test-results="skipped" />
</template>

<style scoped lang="scss"></style>
