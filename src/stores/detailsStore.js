import { defineStore } from 'pinia';

export const useDetailsStore = defineStore('details', {
  state: () => ({
    results: {},
    screenshots: {},
  }),
  getters: {
    allResultsOpened: (state) => {
      const values = Object.values(state.results);
      return values.length > 0 && values.every((item) => item);
    },
    allScreenshotsOpened: (state) => {
      const values = Object.values(state.screenshots);
      return values.length > 0 && values.every((item) => item);
    },
  },
  actions: {
    initItems(count) {
      for (let i = 0; i < count; i++) {
        this.results[i] = false;
        this.screenshots[i] = false;
      }
    },
    setResultOpened(index, opened) {
      this.results[index] = opened;
    },
    toggleAllResults(opened) {
      for (const index in this.results) {
        this.results[index] = opened;
      }
    },
    setScreenshotOpened(index, opened) {
      this.screenshots[index] = opened;
    },
    toggleAllScreenshots(opened) {
      for (const index in this.screenshots) {
        this.screenshots[index] = opened;
      }
    },
  },
});
