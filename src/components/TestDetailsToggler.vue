<script setup>
import { ref } from 'vue';

const emit = defineEmits(['toggle:results', 'toggle:screenshots']);

const resultsOpen = ref(false);
const screenshotsOpen = ref(false);

function toggleResults(isOpen) {
  resultsOpen.value = isOpen;
  emit('toggle:results', isOpen);
}

function toggleScreenshots(isOpen) {
  screenshotsOpen.value = isOpen;
  emit('toggle:screenshots', isOpen);

  if (isOpen) {
    resultsOpen.value = true;
    emit('toggle:results', true);
  }
}
</script>

<template>
  <div class="btn-group">
    <button class="btn btn--small" @click="toggleResults(!resultsOpen)">
      {{ resultsOpen ? 'Collapse' : 'Expand' }} All Results
    </button>
    <button class="btn btn--small" @click="toggleScreenshots(!screenshotsOpen)">
      {{ screenshotsOpen ? 'Collapse' : 'Expand' }} All Screenshots
    </button>
  </div>
</template>
