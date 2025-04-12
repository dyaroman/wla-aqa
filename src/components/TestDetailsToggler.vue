<script setup>
import { ref } from 'vue';

const emit = defineEmits(['toggle:results', 'toggle:screenshots']);

const resultsOpen = ref(false);
const screenshotsOpen = ref(false);

function toggleResults(newValue) {
  resultsOpen.value = newValue;
  emit('toggle:results', newValue);
}

function toggleScreenshots(newValue) {
  screenshotsOpen.value = newValue;
  emit('toggle:screenshots', newValue);
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
