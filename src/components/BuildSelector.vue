<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { reformatBuildNumber, timeAgo } from '@/misc/helpers.js';
import { useAppStore } from '@/stores/appStore.js';

const { buildNumber } = storeToRefs(useAppStore());
const { builds } = defineProps({
  builds: {
    type: Array,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const groupedBuilds = computed(() => groupItemsByDate(builds));

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
    <h2>Select build:</h2>
    <select class="select" v-model="buildNumber" :disabled="disabled">
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
