<script setup>
defineProps({
  builds: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const emitValue = (event) => {
  emit('update:modelValue', event.target.value);
};

function reformatBuildNumber(str) {
  return String(str).replace(/(\d{4})(\d{2})(\d{2})\.(\d+)/, '$1/$2/$3.$4');
}

function timeAgo(dateString) {
  const eventDate = new Date(dateString);
  const now = new Date();

  const elapsedMs = now.getTime() - eventDate.getTime();

  const seconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}
</script>

<template>
  <section>
    <h4>Select build:</h4>
    <select class="select" :value="modelValue" @change="emitValue">
      <option value="" disabled>Select build</option>
      <option v-for="build in builds" :key="build.number" :value="build.number">
        {{ reformatBuildNumber(build.number) }} - {{ timeAgo(build.timestamp) }}
      </option>
    </select>
  </section>
</template>
