<script setup>
import { reformatBuildNumber, timeAgo } from '@/misc/helpers.js';

defineProps({
  builds: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

function updateValue(event) {
  emit('update:modelValue', event.target.value);
}
</script>

<template>
  <section>
    <h4>Select build:</h4>
    <select
      class="select"
      :value="modelValue"
      @change="updateValue"
      :disabled="disabled"
    >
      <option value="" disabled>Select build</option>
      <option v-for="build in builds" :key="build.number" :value="build.number">
        {{ reformatBuildNumber(build.number) }} - {{ timeAgo(build.timestamp) }}
      </option>
    </select>
  </section>
</template>
