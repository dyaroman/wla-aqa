<script setup>
import ImageWithLoader from "@/components/ImageWithLoader.vue";
import { getBuildPath, reformatErrorMessage } from "@/misc/helpers.js";
import { E2E_BASE_URL } from "@/misc/config.js";
import { useAppStore } from "@/stores/appStore";
import { useDetailsStore } from "@/stores/detailsStore.js";

const appStore = useAppStore();
const detailsStore = useDetailsStore();

const { category, testResult } = defineProps({
  category: {
    type: String,
    required: true,
  },
  testResult: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const errorMessage =
  category === "fail" ? reformatErrorMessage(testResult["err"]?.message) : null;
const path = getBuildPath(appStore.buildNumber, appStore.latestBuildNumber);
const src = `${E2E_BASE_URL}/${path}images/${testResult["img"]}`;
</script>

<template>
  <details
    v-if="category === 'fail'"
    :open="detailsStore.results[index] ?? false"
    @toggle="detailsStore.setResultOpened(index, $event.target.open)"
  >
    <summary>{{ testResult["title"] }}</summary>
    <div class="error-message" v-if="testResult['fail']">
      <pre v-if="errorMessage.includes('{')">{{ errorMessage }}</pre>
      <template v-else>
        {{ errorMessage?.replaceAll("\\", "") }}
      </template>
      <details
        :open="detailsStore.screenshots[index] ?? false"
        @toggle="detailsStore.setScreenshotOpened(index, $event.target.open)"
      >
        <summary>Screenshot</summary>
        <div class="screenshot">
          <ImageWithLoader :src alt="Failed to load screenshot" />
        </div>
      </details>
    </div>
  </details>
  <template v-else>{{ testResult["title"] }}</template>
</template>
