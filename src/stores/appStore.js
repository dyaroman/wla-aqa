import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const allResultsOpen = ref(false);
  const allScreenshotsOpen = ref(false);
  const buildNumber = ref('');
  const latestBuildNumber = ref('');

  return {
    allResultsOpen,
    allScreenshotsOpen,
    buildNumber,
    latestBuildNumber,
  };
});
