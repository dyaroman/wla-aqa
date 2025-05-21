<script setup>
import { useDetailsStore } from '@/stores/detailsStore.js';

const detailsStore = useDetailsStore();

function toggleScreenshots(isOpen) {
  detailsStore.toggleAllScreenshots(isOpen);

  if (isOpen && !detailsStore.allResultsOpened) {
    detailsStore.toggleAllResults(true);
  }
}
</script>

<template>
  <div class="btn-group">
    <button
      class="btn"
      @click="detailsStore.toggleAllResults(!detailsStore.allResultsOpened)"
    >
      {{ detailsStore.allResultsOpened ? 'Collapse' : 'Expand' }} all results
    </button>
    <button
      class="btn"
      @click="toggleScreenshots(!detailsStore.allScreenshotsOpened)"
    >
      {{ detailsStore.allScreenshotsOpened ? 'Collapse' : 'Expand' }} all
      screenshots
    </button>
  </div>
</template>
