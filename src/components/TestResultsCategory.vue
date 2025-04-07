<script setup>
import { computed } from 'vue';

import TestResultItem from '@/components/TestResultItem.vue';

const props = defineProps({
  category: {
    type: String,
    required: true,
    validator: (value) => ['pass', 'fail', 'skip'].includes(value),
  },
  testResults: {
    type: Array,
    required: true,
  },
  buildNumber: {
    type: String,
    required: false,
  },
});

const { category, testResults } = props;

const title = computed(() => {
  let title = '';
  switch (category) {
    case 'pass':
      title += 'Passed';
      break;
    case 'fail':
      title += 'Failed';
      break;
    case 'skip':
      title += 'Skipped';
      break;
  }
  title += `: ${testResults.length}`;
  return title;
});
</script>

<template>
  <details
    class="list"
    v-if="testResults.length"
    :open="category === 'fail' && testResults.length > 0"
    :class="{
      pass: category === 'pass',
      fail: category === 'fail',
      skip: category === 'skip',
    }"
  >
    <summary>
      {{ title }}
    </summary>
    <ol>
      <li v-for="testResult in testResults" :key="testResult.uuid">
        <TestResultItem :test-result :build-number :category />
      </li>
    </ol>
  </details>
  <div
    v-else
    :class="{
      pass: category === 'pass',
      fail: category === 'fail',
      skip: category === 'skip',
    }"
  >
    {{ title }}
  </div>
</template>
