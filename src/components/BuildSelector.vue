<script setup>
import { computed } from 'vue';

import { reformatBuildNumber, timeAgo } from '@/misc/helpers.js';

const { builds } = defineProps({
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
const groupedBuilds = computed(() => groupItemsByDate(builds));

function updateValue(event) {
  emit('update:modelValue', event.target.value);
}

function groupItemsByDate(arr) {
  const groups = {};
  for (const item of arr) {
    const date = item.timestamp.split(' ')[1].split('/'); // 04/14/2025
    const group = `${date[2]}/${date[0]}/${date[1]}`; // 2025/04/14
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
  }
  return groups;
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
      <optgroup
        v-for="(group, date) in groupedBuilds"
        :key="date"
        :label="date"
      >
        <option
          v-for="build in group"
          :key="build.number"
          :value="build.number"
        >
          {{ reformatBuildNumber(build.number) }} -
          {{ timeAgo(build.timestamp) }}
        </option>
      </optgroup>
    </select>
  </section>
</template>
