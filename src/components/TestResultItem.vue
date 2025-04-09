<script setup>
import { inject, ref } from 'vue';

import Loader from '@/components/Loader.vue';
import { getBuildPath, reformatErrorMessage } from '@/misc/helpers.js';

const buildNumber = inject('buildNumber');
const latestBuildNumber = inject('latestBuildNumber');

const { category, testResult } = defineProps({
  category: {
    type: String,
    required: true,
  },
  testResult: {
    type: Object,
    required: true,
  },
});

const title = `${testResult['emoji']} ${testResult['title']}`;
const errorMessage =
  category === 'fail' ? reformatErrorMessage(testResult['err']?.message) : null;

const screenshotSrc = ref(null);
const isScreenshotLoading = ref(false);

const startScreenshotLoading = () => {
  if (!screenshotSrc.value) {
    const path = getBuildPath(buildNumber['value'], latestBuildNumber['value']);
    screenshotSrc.value = `https://dyaroman.github.io/wla-e2e/data/${path}images/${testResult['img']}`;
    isScreenshotLoading.value = true;
  }
};
</script>

<template>
  <details v-if="category === 'fail'">
    <summary>{{ title }}</summary>
    <div class="error-message" v-if="testResult['fail']">
      <pre v-if="errorMessage.includes('{')">{{ errorMessage }}</pre>
      <template v-else>
        {{ errorMessage?.replaceAll('\\', '') }}
      </template>
      <details>
        <summary @click="startScreenshotLoading">Screenshot</summary>
        <div class="screenshot">
          <Loader v-if="isScreenshotLoading" />
          <img
            v-show="!isScreenshotLoading && screenshotSrc"
            :src="screenshotSrc"
            alt="Failed to load screenshot"
            @load="isScreenshotLoading = false"
            @error="isScreenshotLoading = false"
          />
        </div>
      </details>
    </div>
  </details>
  <template v-else>{{ title }}</template>
</template>
