<script setup>
defineProps({
  testResult: {
    type: Object,
    required: true,
  },
  buildNumber: {
    type: String,
    default: '',
  }
});
</script>

<template>
  <details>
    <summary>{{ testResult.title }}</summary>
    <div class="error" v-if="testResult.fail">
      <img
        :src="`https://dyaroman.github.io/wla-e2e/data/${buildNumber ? buildNumber + '/' : ''}images/${testResult.img}`"
        :alt="testResult.err?.message?.replaceAll('\\', '')"
      />
      {{ testResult.err?.message?.replaceAll('\\', '') }}
    </div>
  </details>
</template>

<style scoped lang="scss">
.error {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;

  font-size: 14px;
}

img {
  max-width: 100%;
  max-height: 100vh;

  border: 2px solid darkred;
}
</style>
