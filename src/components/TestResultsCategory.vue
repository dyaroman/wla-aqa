<script setup>
import { onMounted } from 'vue';

import TestResultItem from '@/components/TestResultItem.vue';
import { useDetailsStore } from '@/stores/detailsStore.js';

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

const initialOpen = category === 'fail' && testResults.length > 0;
const detailsStore = useDetailsStore();

onMounted(() => {
  if (category === 'fail') {
    detailsStore.initItems(testResults.length);
  }
});
</script>

<template>
  <details
    class="list"
    v-if="testResults.length"
    :open="initialOpen"
    :class="{
      pass: category === 'pass',
      fail: category === 'fail',
      skip: category === 'skip',
    }"
  >
    <summary>
      {{ title }}
    </summary>
    <ul>
      <li v-for="(testResult, index) in testResults" :key="testResult.uuid">
        <TestResultItem :category :test-result :index />
      </li>
    </ul>
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

<style scoped>
.fail ul {
  padding-left: 20px;

  list-style: none;
}
</style>
