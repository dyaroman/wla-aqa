<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number, Boolean],
    required: true,
  },
  value: {
    type: [String, Number, Boolean],
    required: true,
  },
});

defineEmits(['update:modelValue']);
</script>

<template>
  <label class="radio">
    <input
      type="radio"
      class="radio__input"
      :name
      :value
      :checked="modelValue === value"
      @change="$emit('update:modelValue', value)"
    />
    <span class="radio__custom"></span>
    <span class="radio__label"><slot /></span>
  </label>
</template>
