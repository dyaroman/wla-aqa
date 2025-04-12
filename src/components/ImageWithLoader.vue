<script setup>
import { onMounted, ref } from 'vue';

import Loader from '@/components/Loader.vue';

defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
});

const isLoading = ref(false);

onMounted(() => {
  isLoading.value = true;
});
</script>

<template>
  <div class="container" :style="{ minHeight: isLoading ? '140px' : null }">
    <Loader v-if="isLoading" />

    <img
      :src
      :alt
      :style="{
        opacity: isLoading ? 0 : 1,
      }"
      class="img"
      loading="lazy"
      @load="isLoading = false"
      @error="isLoading = false"
    />
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100%;
}

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.img {
  width: 100%;
  height: auto;
  vertical-align: middle;
  transition: opacity 0.3s ease-in-out;
}
</style>
