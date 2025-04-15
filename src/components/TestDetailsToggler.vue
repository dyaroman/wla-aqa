<script setup>
import { ref } from 'vue';

import { useAppStore } from '@/stores/appStore';

const appStore = useAppStore();

const emit = defineEmits(['toggle:screenshots']);

const screenshotsOpen = ref(false);

function toggleScreenshots(isOpen) {
  screenshotsOpen.value = isOpen;
  emit('toggle:screenshots', isOpen);

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
    <button class="btn btn--small" @click="toggleScreenshots(!screenshotsOpen)">
      {{ screenshotsOpen ? 'Collapse' : 'Expand' }} All Screenshots
    </button>
  </div>
</template>
