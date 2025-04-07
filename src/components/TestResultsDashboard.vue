<script setup>
import { computed, onMounted } from 'vue';

import TestResultsCategory from '@/components/TestResultsCategory.vue';
import { updateFavicon } from '@/misc/helpers.js';

const { testResults } = defineProps({
  testResults: {
    type: Array,
    required: true,
  },
  buildNumber: {
    type: String,
    required: true,
  },
});

const passed = computed(() => testResults.filter((test) => test.pass));
const failed = computed(() => testResults.filter((test) => test.fail));
const skipped = computed(() => testResults.filter((test) => test.skipped));

const documentTitle = computed(
  () => `[${failed.value.length}/${testResults.length}]: AQA`,
);
const shouldShowGreenFavicon = computed(() => failed.value.length === 0);

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
