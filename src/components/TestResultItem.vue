<script setup>
import { inject } from 'vue';

import ImageWithLoader from '@/components/ImageWithLoader.vue';
import { getBuildPath, reformatErrorMessage } from '@/misc/helpers.js';

const buildNumber = inject('buildNumber');
const latestBuildNumber = inject('latestBuildNumber');
const allResultsOpen = inject('allResultsOpen');
const allScreenshotsOpen = inject('allScreenshotsOpen');

const { category, testResult } = defineProps({
  category: {
    type: String,
    required: true,
  },
  testResult: {
    type: Object,
    required: true,
  },
  isAllItemsOpen: {
    type: Boolean,
    required: false,
    default: false,
  },
  isAllScreenshotsOpen: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const title = `${testResult['emoji']} ${testResult['title']}`;
const errorMessage =
  category === 'fail' ? reformatErrorMessage(testResult['err']?.message) : null;
const path = getBuildPath(buildNumber['value'], latestBuildNumber['value']);
const src = `https://dyaroman.github.io/wla-e2e/data/${path}images/${testResult['img']}`;
</script>

<template>
  <details v-if="category === 'fail'" :open="allResultsOpen">
    <summary>{{ title }}</summary>
    <div class="error-message" v-if="testResult['fail']">
      <pre v-if="errorMessage.includes('{')">{{ errorMessage }}</pre>
      <template v-else>
        {{ errorMessage?.replaceAll('\\', '') }}
      </template>
      <details :open="allScreenshotsOpen">
        <summary>Screenshot</summary>
        <div class="screenshot">
          <ImageWithLoader :src alt="Failed to load screenshot" />
        </div>
      </details>
    </div>
  </details>
  <template v-else>{{ title }}</template>
</template>
