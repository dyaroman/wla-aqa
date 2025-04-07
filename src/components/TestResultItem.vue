<script setup>
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

const { testResult, buildNumber } = props;
const errorMessage = testResult.err?.message?.replaceAll('\\', '');
const src = `https://dyaroman.github.io/wla-e2e/data/${buildNumber ? `${buildNumber}/` : ''}images/${testResult.img}`;
</script>

<template>
  <details v-if="category === 'fail'">
    <summary>{{ testResult.title }}</summary>
    <div class="error-message" v-if="testResult.fail">
      <img :src :alt="errorMessage" />
      {{ errorMessage }}
    </div>
  </details>
  <template v-else>
    {{ testResult.title }}
  </template>
</template>
