<script setup>
import { computed, onMounted, provide, readonly, ref, watchEffect } from 'vue';

import Loader from '@/components/Loader.vue';
import BuildSelector from '@/components/BuildSelector.vue';
import BuildPipelineInfo from '@/components/BuildPipelineInfo.vue';
import TestResultsDashboard from '@/components/TestResultsDashboard.vue';
import TestDetailsToggler from '@/components/TestDetailsToggler.vue';
import { getBuildPath, updateBuildNumberInUrl } from '@/misc/helpers.js';

const appInit = ref(false);
const dataLoaded = ref(false);
const buildsInfo = ref([]); // previous + latest
const buildNumber = ref('');
const buildInfo = ref(null);
const testResults = ref([]);
const allResultsOpen = ref(false);
const allScreenshotsOpen = ref(false);

const latestBuildNumber = computed(() => buildsInfo.value[0]?.number || '');
const buildNumberFromUrl = new URLSearchParams(window.location.search).get(
  'build',
);

provide('buildNumber', readonly(buildNumber));
provide('latestBuildNumber', readonly(latestBuildNumber));
provide('allResultsOpen', readonly(allResultsOpen));
provide('allScreenshotsOpen', readonly(allScreenshotsOpen));

async function loadBuildsInfo() {
  const [previousBuildsInfo, latestBuildInfo] = await Promise.all([
    fetch(`https://dyaroman.github.io/wla-e2e/data/builds.json`).then((res) =>
      res.json(),
    ),
    fetch(`https://dyaroman.github.io/wla-e2e/data/build-info.json`)
      .then((res) => res.json())
      .then((json) => ({
        number: json['buildNumber'],
        timestamp: json['buildTimestamp'],
      })),
  ]);
  buildsInfo.value = [...previousBuildsInfo, latestBuildInfo]
    .map((build) => {
      build['number'] = build['number'].toString();
      return build;
    })
    .reverse();
}

async function loadBuildData() {
  const path = getBuildPath(buildNumber.value, latestBuildNumber.value);
  const [buildInfoJson, testResultsJson] = await Promise.all([
    fetch(`https://dyaroman.github.io/wla-e2e/data/${path}build-info.json`).then(
      (res) => res.json(),
    ),
    fetch(`https://dyaroman.github.io/wla-e2e/data/${path}results.json`).then(
      (res) => res.json(),
    ),
  ]);
  buildInfo.value = buildInfoJson;
  testResults.value = testResultsJson;
  dataLoaded.value = true;
}

async function updateSelectedBuildNumber(newValue) {
  buildNumber.value = newValue;
  dataLoaded.value = false;
  await loadBuildData();
}

function initializeBuildNumber() {
  buildNumber.value =
    (buildNumberFromUrl &&
      buildsInfo.value.find((build) => build['number'] === buildNumberFromUrl)
        ?.number) ||
    latestBuildNumber.value;
}

watchEffect(() => updateBuildNumberInUrl(buildNumber.value));

onMounted(async () => {
  try {
    await loadBuildsInfo();
    initializeBuildNumber();
    await loadBuildData();
    appInit.value = true;
  } catch (e) {
    console.error('Error fetching data:', e);
  }
});
</script>

<template>
  <Loader v-if="!appInit" fixed />
  <template v-else>
    <h3><a href="/">AQA</a></h3>
    <BuildSelector
      :builds="buildsInfo"
      :model-value="buildNumber"
      :disabled="!dataLoaded"
      @update:model-value="updateSelectedBuildNumber"
    />
    <Loader v-if="!dataLoaded" />
    <template v-else>
      <BuildPipelineInfo :build-id="buildInfo.buildId" :build-number />
      <TestDetailsToggler
        @toggle:results="(isOpen) => (allResultsOpen = isOpen)"
        @toggle:screenshots="(isOpen) => (allScreenshotsOpen = isOpen)"
      />
      <TestResultsDashboard :test-results />
    </template>
  </template>
</template>
