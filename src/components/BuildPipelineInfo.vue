<script setup>
const props = defineProps({
  buildId: {
    type: String,
    required: true,
  },
  buildNumber: {
    type: String,
    required: true,
  },
});

const { buildId } = props;

const buildLink = `https://github.com/dyaroman/wla-e2e/_build/results?buildId=${buildId}&view=results`;
</script>

<template>
  <section>
    <h4>
      Build:
      <a :href="buildLink" target="_blank" rel="noopener noreferrer"
        >#{{ buildNumber }}</a
      >
    </h4>
  </section>
</template>
