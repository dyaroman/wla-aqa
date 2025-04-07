<script setup>
import { onMounted, ref, watch } from 'vue';
import Loader from '@/components/Loader.vue';
import BuildSelector from '@/components/BuildSelector.vue';
import PipelineInfo from '@/components/PipelineInfo.vue';
import TestResultsDashboard from '@/components/TestResultsDashboard.vue';

const appInit = ref(false);
const dataLoaded = ref(false);
const buildsInfo = ref([]); // previous + latest
const buildInfo = ref(null);
const testsResultsData = ref([]);
const selectedBuildNumber = ref('');

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

function getBuildNumberFromUrl() {
  const latestBuildNumber = buildsInfo.value[0].number;
  const buildNumberFromUrl = new URLSearchParams(window.location.search).get(
    'build',
  );

  // if no build in url than use latest
  if (!buildNumberFromUrl) {
    selectedBuildNumber.value = latestBuildNumber;
    return;
  }

  const validBuildNumber = buildsInfo.value.find(
    (build) => build.number.toString() === buildNumberFromUrl,
  )?.number;
  if (validBuildNumber) {
    selectedBuildNumber.value = validBuildNumber;
  } else {
    // if in url not valid build number than use latest
    selectedBuildNumber.value = latestBuildNumber;
    updateBuildNumberInUrl('');
  }
}

async function loadBuildData() {
  let buildNumber = selectedBuildNumber.value;
  if (buildNumber.toString() === buildsInfo.value[0].number.toString()) {
    buildNumber = '';
  }
  if (buildNumber !== '') {
    buildNumber = `${buildNumber}/`;
  }
  const [buildInfoJson, testResultsJson] = await Promise.all([
    fetch(
      `https://dyaroman.github.io/wla-e2e/data/${buildNumber}build-info.json`,
    ).then((res) => res.json()),
    fetch(
      `https://dyaroman.github.io/wla-e2e/data/${buildNumber}results.json`,
    ).then((res) => res.json()),
  ]);
  buildInfo.value = buildInfoJson;
  testsResultsData.value = testResultsJson;
  dataLoaded.value = true;
}

function updateBuildNumberInUrl(buildNumber) {
  const url = new URL(window.location.href);
  if (buildNumber) {
    url.searchParams.set('build', buildNumber);
  } else {
    url.searchParams.delete('build');
  }
  window.history.replaceState({}, document.title, url.toString());
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
    getBuildNumberFromUrl();
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
      @update:model-Value="updateSelectedBuildNumber"
    />
    <Loader v-if="!dataLoaded" />
    <template v-else>
      <PipelineInfo
        :build-id="buildInfo.buildId.toString()"
        :build-number="selectedBuildNumber.toString()"
      />
      <TestResultsDashboard
        :tests-results="testsResultsData"
        :build-number="selectedBuildNumber.toString()"
      />
    </template>
  </template>
</template>

<style lang="scss">
@use 'styles/index.scss';
</style>
