<script setup>
import { onMounted, ref, watch, computed } from 'vue';

import Loader from '@/components/Loader.vue';
import BuildSelector from '@/components/BuildSelector.vue';
import BuildPipelineInfo from '@/components/BuildPipelineInfo.vue';
import TestResultsDashboard from '@/components/TestResultsDashboard.vue';
import { updateBuildNumberInUrl } from '@/misc/helpers.js';

const appInit = ref(false);
const dataLoaded = ref(false);
const buildsInfo = ref([]); // previous + latest
const selectedBuildNumber = ref('');
const buildInfo = ref(null);
const testResults = ref([]);

const latestBuildNumber = computed(() => buildsInfo.value[0]?.number || '');
const buildNumberFromUrl = new URLSearchParams(window.location.search).get(
  'build',
);
const currentBuildNumber = computed(() => {
  if (!buildNumberFromUrl) {
    return latestBuildNumber.value;
  }

  const validBuildNumber = buildsInfo.value.find(
    (build) => build.number.toString() === buildNumberFromUrl,
  )?.number;

  return validBuildNumber || latestBuildNumber.value;
});

const buildNumber = computed(() => {
  let buildNumber = selectedBuildNumber.value;
  if (buildNumber.toString() === latestBuildNumber.value.toString()) {
    buildNumber = '';
  }
  if (buildNumber !== '') {
    buildNumber = `${buildNumber}/`;
  }
  return buildNumber;
});

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
  buildsInfo.value = [...previousBuildsInfo, latestBuildInfo].reverse();
}

async function loadBuildData() {
  const [buildInfoJson, testResultsJson] = await Promise.all([
    fetch(
      `https://dyaroman.github.io/wla-e2e/data/${buildNumber.value}build-info.json`,
    ).then((res) => res.json()),
    fetch(
      `https://dyaroman.github.io/wla-e2e/data/${buildNumber.value}results.json`,
    ).then((res) => res.json()),
  ]);
  buildInfo.value = buildInfoJson;
  testResults.value = testResultsJson;
  dataLoaded.value = true;
}

async function updateSelectedBuildNumber(newValue) {
  selectedBuildNumber.value = newValue;
  dataLoaded.value = false;
  await loadBuildData();
}

watch(selectedBuildNumber, (newValue) => updateBuildNumberInUrl(newValue));

onMounted(async () => {
  try {
    await loadBuildsInfo();
    selectedBuildNumber.value = currentBuildNumber.value;
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
      :model-value="selectedBuildNumber.toString()"
      @update:model-value="updateSelectedBuildNumber"
    />
    <Loader v-if="!dataLoaded" />
    <template v-else>
      <BuildPipelineInfo
        :build-id="buildInfo.buildId.toString()"
        :build-number="selectedBuildNumber.toString()"
      />
      <TestResultsDashboard
        :build-number="selectedBuildNumber.toString()"
        :test-results
      />
    </template>
  </template>
</template>
