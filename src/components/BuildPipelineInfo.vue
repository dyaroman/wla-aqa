<script setup>
import { useAppStore } from '@/stores/appStore.js';

const appStore = useAppStore();
const { buildInfo } = defineProps({
  buildInfo: {
    type: Object,
    required: true,
  },
});

const buildLink = `https://github.com/dyaroman/wla-e2e/_build/results?buildId=${buildInfo?.['buildId']}&view=results`;

const pipelineBranch = buildInfo?.['pipelineBranch']?.replace(
  'refs/heads/',
  '',
);
const gitLink = `https://github.com/dyaroman/wla-e2e/_git/wla-e2e?path=/&version=GB${pipelineBranch}`;
const formsLink = buildInfo?.['formsUrl'];
</script>

<template>
  <section>
    <h2>
      Build:
      <a :href="buildLink" target="_blank" rel="noopener noreferrer"
        >#{{ appStore.buildNumber }}</a
      >
    </h2>
    <h2 v-if="buildInfo['pipelineBranch']">
      Pipeline branch:
      <a :href="gitLink" target="_blank" rel="noopener noreferrer">{{
        pipelineBranch
      }}</a>
    </h2>
    <h2 v-if="formsLink">
      Forms feature branch:
      <a :href="formsLink" target="_blank" rel="noopener noreferrer">{{
        formsLink.replace(/https?:\/\//, '')
      }}</a>
    </h2>
  </section>
</template>
