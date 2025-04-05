<script setup>
import { computed } from 'vue';
import TestResult from '@/components/TestResult.vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['pass', 'fail', 'skip'].includes(value),
  },
  testsResults: {
    type: Array,
    required: true,
  },
  buildNumber: {
    type: String,
    required: false,
  }
});

const { type, testsResults } = props;

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
  title += `: ${testsResults.length}`;
  return title;
});
</script>

<template>
  <details
    class="list"
    :open="type === 'fail' && testsResults.length > 0"
    :class="{
      pass: type === 'pass',
      fail: type === 'fail',
      skip: type === 'skip',
    }"
  >
    <summary>
      {{ title }}
    </summary>
    <ul>
      <li v-for="testResult in testsResults" :key="testResult.uuid">
        <TestResult :testResult :build-number />
      </li>
    </ul>
  </details>
</template>

<style lang="scss">
.pass {
  color: forestgreen;
}

.fail {
  color: darkred;
}

.skip {
  color: darkgrey;
}
</style>

<style scoped lang="scss">
.list {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1rem;

  list-style: none;
}
</style>
