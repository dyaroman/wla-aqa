<script setup>
defineProps({
  fixed: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="loader" :class="{ 'loader--fixed': fixed }">
    <div class="lds-spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>
