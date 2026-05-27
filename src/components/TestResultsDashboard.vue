<script setup>
import { computed, onMounted } from "vue";

import TestResultsCategory from "@/components/TestResultsCategory.vue";
import { updateFavicon } from "@/misc/helpers.js";

const { testResults, hasFailedTests } = defineProps({
  testResults: {
    type: Array,
    required: true,
  },
  hasFailedTests: {
    type: Boolean,
    required: true,
  },
});

const passed = computed(() => testResults.filter((test) => test.pass));
const failed = computed(() => testResults.filter((test) => test.fail));
const skipped = computed(() => testResults.filter((test) => test.skipped));

const documentTitle = computed(
  () =>
    `[${passed.value.length}/${passed.value.length + failed.value.length}]: AQA`,
);

onMounted(() => {
  document.title = documentTitle.value;
  updateFavicon(!hasFailedTests);
});
</script>

<template>
  <TestResultsCategory category="fail" :test-results="failed" />
  <TestResultsCategory category="pass" :test-results="passed" />
  <TestResultsCategory category="skip" :test-results="skipped" />
</template>
