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
  <section class="build-info">
    <div class="build-info__row">
      <div class="build-info__key">Build</div>
      <div class="build-info__value">
        <a :href="buildLink" target="_blank" rel="noopener noreferrer"
          >#{{ appStore.buildNumber }}</a
        >
      </div>
    </div>

    <div v-if="buildInfo['pipelineBranch']" class="build-info__row">
      <div class="build-info__key">Pipeline branch</div>
      <div class="build-info__value">
        <a :href="gitLink" target="_blank" rel="noopener noreferrer">{{
          pipelineBranch
        }}</a>
      </div>
    </div>

    <div v-if="formsLink" class="build-info__row">
      <div class="build-info__key">Forms feature branch</div>
      <div class="build-info__value">
        <a :href="formsLink" target="_blank" rel="noopener noreferrer">{{
          formsLink.replace(/https?:\/\//, '')
        }}</a>
      </div>
    </div>

    <div v-if="buildInfo['grep']" class="build-info__row">
      <div class="build-info__key">Tag</div>
      <div class="build-info__value">{{ buildInfo['grep'] }}</div>
    </div>

    <div v-if="buildInfo['mode']" class="build-info__row">
      <div class="build-info__key">Mode</div>
      <div class="build-info__value">{{ buildInfo['mode'] }}</div>
    </div>

    <div v-if="buildInfo['env']" class="build-info__row">
      <div class="build-info__key">Env</div>
      <div class="build-info__value">{{ buildInfo['env'] }}</div>
    </div>
  </section>
</template>
