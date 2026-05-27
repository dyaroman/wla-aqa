<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";

import { reformatBuildNumber, timeAgo } from "@/misc/helpers.js";
import { useAppStore } from "@/stores/appStore.js";

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
    const d = new Date(item.timestamp);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const group = `${year}/${month}/${day}`;
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
    <div
      class="select-wrapper"
      :class="{ 'select-wrapper--disabled': disabled }"
    >
      <select class="select" v-model="buildNumber" :disabled>
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
    </div>
  </section>
</template>
