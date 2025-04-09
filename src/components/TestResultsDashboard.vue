<script setup>
import { computed, onMounted } from 'vue';

import TestResultsCategory from '@/components/TestResultsCategory.vue';
import { updateFavicon } from '@/misc/helpers.js';
import { getFailEmoji, getPassEmoji, getSkipEmoji } from '@/misc/emojis.js';

const { testResults } = defineProps({
  testResults: {
    type: Array,
    required: true,
  },
});

const passed = computed(() =>
  testResults
    .filter((test) => test.pass)
    .map((test) => {
      test['emoji'] = getPassEmoji();
      return test;
    }),
);
const failed = computed(() =>
  testResults
    .filter((test) => test.fail)
    .map((test) => {
      test['emoji'] = getFailEmoji();
      return test;
    }),
);
const skipped = computed(() =>
  testResults
    .filter((test) => test.skipped)
    .map((test) => {
      test['emoji'] = getSkipEmoji();
      return test;
    }),
);

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
  <TestResultsCategory category="fail" :test-results="failed" />
  <TestResultsCategory category="pass" :test-results="passed" />
  <TestResultsCategory category="skip" :test-results="skipped" />
</template>
