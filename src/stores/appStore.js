import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const buildNumber = ref('');
  const latestBuildNumber = ref('');
  const showPipelineDrawer = ref(false);

  return {
    buildNumber,
    latestBuildNumber,
    showPipelineDrawer,
  };
});
