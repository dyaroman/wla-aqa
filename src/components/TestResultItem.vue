<script setup>
import { reformatErrorMessage } from '@/misc/helpers.js';

const { buildNumber, category, testResult } = defineProps({
  buildNumber: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
  },
  testResult: {
    type: Object,
    required: true,
  },
});

const errorMessage =
  category === 'fail' ? reformatErrorMessage(testResult.err?.message) : null;

const src =
  category === 'fail'
    ? `https://dyaroman.github.io/wla-e2e/data/${buildNumber ? `${buildNumber}/` : ''}images/${testResult.img}`
    : null;
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
