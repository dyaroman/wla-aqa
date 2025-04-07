<script setup>
defineProps({
  testResult: {
    type: Object,
    required: true,
  },
  buildNumber: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <details v-if="type === 'fail'">
    <summary>{{ testResult.title }}</summary>
    <div class="error-message" v-if="testResult.fail">
      <img
        :src="`https://dyaroman.github.io/wla-e2e/data/${buildNumber ? buildNumber + '/' : ''}images/${testResult.img}`"
        :alt="testResult.err?.message?.replaceAll('\\', '')"
      />
      {{ testResult.err?.message?.replaceAll('\\', '') }}
    </div>
  </details>
  <template v-else>
    {{ testResult.title }}
  </template>
</template>
