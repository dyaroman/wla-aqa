<script setup>
import TestResultItem from '@/components/TestResultItem.vue';

const { category, testResults } = defineProps({
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
  default:
    title += 'Unknown category';
    break;
}
title += `: ${testResults.length}`;

const isOpen = category === 'fail' && testResults.length > 0;
</script>

<template>
  <details
    class="list"
    v-if="testResults.length"
    :open="isOpen"
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
