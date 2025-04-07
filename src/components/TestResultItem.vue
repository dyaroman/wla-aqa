<script setup>
import { computed } from 'vue';

import { reformatErrorMessage } from '@/misc/helpers.js';

const props = defineProps({
  testResult: {
    type: Object,
    required: true,
  },
  buildNumber: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
  },
});

const errorMessage = computed(() => {
  if (props.category === 'fail') {
    return reformatErrorMessage(props.testResult.err?.message);
  }
  return null;
});

const src = computed(() => {
  if (props.category === 'fail') {
    return `https://dyaroman.github.io/wla-e2e/data/${props.buildNumber ? `${props.buildNumber}/` : ''}images/${props.testResult.img}`;
  }
  return null;
});
</script>

<template>
  <details v-if="category === 'fail'">
    <summary>{{ testResult.title }}</summary>
    <div class="error-message" v-if="testResult.fail">
      <img :src :alt="errorMessage" />
      <pre v-if="errorMessage.includes('{')"
        >{{ errorMessage }}
      </pre>
      <template v-else>
        {{ errorMessage?.replaceAll('\\', '') }}
      </template>
    </div>
  </details>
  <template v-else>
    {{ testResult.title }}
  </template>
</template>
