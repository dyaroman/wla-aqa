<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import Loader from '@/components/Loader.vue';
import BuildSelector from '@/components/BuildSelector.vue';
import BuildPipelineInfo from '@/components/BuildPipelineInfo.vue';
import TestResultsDashboard from '@/components/TestResultsDashboard.vue';
import TestDetailsToggle from '@/components/TestDetailsToggle.vue';
import { getBuildPath, updateBuildNumberInUrl } from '@/misc/helpers.js';
import { useAppStore } from '@/stores/appStore';

const appStore = useAppStore();
const appInit = ref(false);
const dataLoaded = ref(false);
const failedLoadData = ref(false);
const buildsInfo = ref([]); // previous + latest
const buildInfo = ref(null);
const testResults = ref([]);
const conclusionImage = ref(null);

const hasFailedTests = computed(
  () => testResults.value.filter((test) => test.fail).length > 0,
);
const buildNumberFromUrl = new URLSearchParams(window.location.search).get(
  'build',
);

async function loadBuildsInfo() {
  try {
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
  } catch (error) {
    console.error('Failed to load builds info:', error.message);
    failedLoadData.value = true;
  }
}

async function loadBuildData() {
  try {
    const path = getBuildPath(appStore.buildNumber, appStore.latestBuildNumber);
    const [buildInfoJson, testResultsJson] = await Promise.all([
      fetch(
        `https://dyaroman.github.io/wla-e2e/data/${path}build-info.json`,
      ).then((res) => res.json()),
      fetch(`https://dyaroman.github.io/wla-e2e/data/${path}results.json`).then(
        (res) => res.json(),
      ),
    ]);
    buildInfo.value = buildInfoJson;
    testResults.value = testResultsJson;
    appStore.allResultsOpen = false;
    appStore.allScreenshotsOpen = false;
    dataLoaded.value = true;
  } catch (error) {
    console.error('Failed to load build data:', error.message);
    failedLoadData.value = true;
  }
}

async function loadConclusionImage() {
  conclusionImage.value = null;

  await fetch(
    `https://yesno.wtf/api?force=${hasFailedTests.value ? 'no' : 'yes'}`,
  )
    .then((res) => res.json())
    .then((json) => (conclusionImage.value = json.image))
    .catch((error) =>
      console.error('Failed to load conclusion image:', error.message),
    );
}

function initializeBuildNumber() {
  appStore.buildNumber =
    (buildNumberFromUrl &&
      buildsInfo.value.find((build) => build['number'] === buildNumberFromUrl)
        ?.number) ||
    appStore.latestBuildNumber;
}

watch(
  () => appStore.buildNumber,
  async (newValue) => {
    dataLoaded.value = false;
    updateBuildNumberInUrl(newValue);
    await loadBuildData();
    await loadConclusionImage();
  },
);

onMounted(async () => {
  try {
    await loadBuildsInfo();
    appStore.latestBuildNumber = buildsInfo.value[0]?.number || '';
    initializeBuildNumber();
    appInit.value = true;
  } catch (error) {
    console.error('Failed to initialize app:', error.message);
  }
});
</script>

<template>
  <Loader v-if="!appInit" fixed />
  <template v-else-if="failedLoadData">
    <h2>Failed to load tests results data</h2>
  </template>
  <template v-else>
    <h1><a href="/">AQA</a></h1>
    <BuildSelector :builds="buildsInfo" :disabled="!dataLoaded" />
    <Loader v-if="!dataLoaded" />
    <template v-else>
      <BuildPipelineInfo :build-info />
      <TestDetailsToggle v-if="hasFailedTests" />
      <figure v-if="conclusionImage" class="conclusion-image">
        <img :src="conclusionImage" alt="Conclusion Image" />
        <figcaption>{{ hasFailedTests ? '-100' : '+1000' }} Aura</figcaption>
      </figure>
      <TestResultsDashboard :test-results />
    </template>
  </template>
</template>
