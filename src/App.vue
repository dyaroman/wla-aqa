<script setup>
import { computed, onMounted, provide, readonly, ref, watchEffect } from 'vue';

import Loader from '@/components/Loader.vue';
import BuildSelector from '@/components/BuildSelector.vue';
import BuildPipelineInfo from '@/components/BuildPipelineInfo.vue';
import TestResultsDashboard from '@/components/TestResultsDashboard.vue';
import TestDetailsToggler from '@/components/TestDetailsToggler.vue';
import { getBuildPath, updateBuildNumberInUrl } from '@/misc/helpers.js';
import { useAppStore } from '@/stores/appStore';

const appStore = useAppStore();
const appInit = ref(false);
const dataLoaded = ref(false);
const failedLoadData = ref(false);
const buildsInfo = ref([]); // previous + latest
const buildNumber = ref('');
const buildInfo = ref(null);
const testResults = ref([]);
const allScreenshotsOpen = ref(false);
const conclusionImage = ref(null);

const latestBuildNumber = computed(() => buildsInfo.value[0]?.number || '');
const hasFailedTests = computed(
  () => testResults.value.filter((test) => test.fail).length > 0,
);
const buildNumberFromUrl = new URLSearchParams(window.location.search).get(
  'build',
);

provide('buildNumber', readonly(buildNumber));
provide('latestBuildNumber', readonly(latestBuildNumber));
provide('allScreenshotsOpen', readonly(allScreenshotsOpen));

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
    const path = getBuildPath(buildNumber.value, latestBuildNumber.value);
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
    allScreenshotsOpen.value = false;
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

async function updateSelectedBuildNumber(newValue) {
  buildNumber.value = newValue;
  dataLoaded.value = false;
  await loadBuildData();
  await loadConclusionImage();
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
    await loadConclusionImage();
    appInit.value = true;
  } catch (error) {
    console.error('Failed to initialize app:', error.message);
  }
});
</script>

<template>
  <Loader v-if="!appInit" fixed />
  <template v-else-if="failedLoadData">
    <h3>Failed to load tests results data</h3>
  </template>
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
      <section v-if="conclusionImage" class="conclusion-image">
        <img :src="conclusionImage" alt="Conclusion Image" />
      </section>
      <BuildPipelineInfo :build-id="buildInfo.buildId" :build-number />
      <TestDetailsToggler
        v-if="hasFailedTests"
        @toggle:screenshots="(isOpen) => (allScreenshotsOpen = isOpen)"
      />
      <TestResultsDashboard :test-results />
    </template>
  </template>
</template>
