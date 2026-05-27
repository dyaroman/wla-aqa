import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useDetailsStore = defineStore('details', () => {
  const results = ref({});
  const screenshots = ref({});

  const allResultsOpened = computed(() => {
    const values = Object.values(results.value);
    return values.length > 0 && values.every((item) => item);
  });

  const allScreenshotsOpened = computed(() => {
    const values = Object.values(screenshots.value);
    return values.length > 0 && values.every((item) => item);
  });

  function initItems(count) {
    // Reset first so stale indices from a previous build don't linger
    results.value = {};
    screenshots.value = {};
    for (let i = 0; i < count; i++) {
      results.value[i] = false;
      screenshots.value[i] = false;
    }
  }

  function setResultOpened(index, opened) {
    results.value[index] = opened;
  }

  function toggleAllResults(opened) {
    for (const index in results.value) {
      results.value[index] = opened;
    }
  }

  function setScreenshotOpened(index, opened) {
    screenshots.value[index] = opened;
  }

  function toggleAllScreenshots(opened) {
    for (const index in screenshots.value) {
      screenshots.value[index] = opened;
    }
  }

  return {
    results,
    screenshots,
    allResultsOpened,
    allScreenshotsOpened,
    initItems,
    setResultOpened,
    toggleAllResults,
    setScreenshotOpened,
    toggleAllScreenshots,
  };
});
