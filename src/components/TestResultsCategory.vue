<script setup>
import { computed } from 'vue';
import TestResultItem from '@/components/TestResultItem.vue';

const props = defineProps({
  type: {
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

const { type, testResults } = props;

const title = computed(() => {
  let title = '';
  switch (type) {
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
    :open="type === 'fail' && testResults.length > 0"
    :class="{
      pass: type === 'pass',
      fail: type === 'fail',
      skip: type === 'skip',
    }"
  >
    <summary>
      {{ title }}
    </summary>
    <ol>
      <li v-for="testResult in testResults" :key="testResult.uuid">
        <TestResultItem :test-result :build-number :type />
      </li>
    </ol>
  </details>
  <div
    v-else
    :class="{
      pass: type === 'pass',
      fail: type === 'fail',
      skip: type === 'skip',
    }"
  >
    {{ title }}
  </div>
</template>

<style scoped lang="scss">
.list {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

ol {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
