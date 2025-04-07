<script setup>
defineProps({
  buildId: {
    type: String,
    required: true,
  },
  buildNumber: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <section>
    <h4>
      Build:
      <a
        :href="`https://github.com/dyaroman/wla-e2e/_build/results?buildId=${buildId}&view=results`"
        target="_blank"
        rel="noopener noreferrer"
        >#{{ buildNumber }}</a
      >
    </h4>
  </section>
</template>

<style scoped lang="scss"></style>
