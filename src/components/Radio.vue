<script setup>
defineProps({
  modelValue: [String, Number, Boolean],
  value: [String, Number, Boolean],
});

defineEmits(['update:modelValue']);
</script>

<template>
  <label class="radio">
    <input
      type="radio"
      class="radio__input"
      :value
      :checked="modelValue === value"
      @change="$emit('update:modelValue', value)"
    />
    <span class="radio__custom"></span>
    <span class="radio__label"><slot /></span>
  </label>
</template>
