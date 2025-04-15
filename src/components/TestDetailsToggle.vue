<script setup>
import { useAppStore } from '@/stores/appStore';

const appStore = useAppStore();

function toggleScreenshots(isOpen) {
  appStore.allScreenshotsOpen = isOpen;

  if (isOpen) {
    appStore.allResultsOpen = true;
  }
}
</script>

<template>
  <div class="btn-group">
    <button
      class="btn btn--small"
      @click="appStore.allResultsOpen = !appStore.allResultsOpen"
    >
      {{ appStore.allResultsOpen ? 'Collapse' : 'Expand' }} All Results
    </button>
    <button
      class="btn btn--small"
      @click="toggleScreenshots(!appStore.allScreenshotsOpen)"
    >
      {{ appStore.allScreenshotsOpen ? 'Collapse' : 'Expand' }} All Screenshots
    </button>
  </div>
</template>
