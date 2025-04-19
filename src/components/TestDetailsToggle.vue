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
      class="btn"
      @click="appStore.allResultsOpen = !appStore.allResultsOpen"
    >
      {{ appStore.allResultsOpen ? 'Collapse' : 'Expand' }} all results
    </button>
    <button
      class="btn"
      @click="toggleScreenshots(!appStore.allScreenshotsOpen)"
    >
      {{ appStore.allScreenshotsOpen ? 'Collapse' : 'Expand' }} all screenshots
    </button>
  </div>
</template>
