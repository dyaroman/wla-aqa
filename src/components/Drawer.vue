<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  position: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'right', 'top', 'bottom'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  closeOnBackdropClick: {
    type: Boolean,
    default: true,
  },
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const handleEscKey = (event) => {
  if (event.key === 'Escape' && props.closeOnEsc && props.modelValue) {
    event.preventDefault();
    event.stopPropagation();
    emit('update:modelValue', false);
  }
};

onMounted(() => {
  if (props.closeOnEsc) {
    document.addEventListener('keydown', handleEscKey);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscKey);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div
        v-if="modelValue"
        class="drawer-backdrop"
        @click="closeOnBackdropClick && $emit('update:modelValue', false)"
      ></div>
    </Transition>
    <Transition :name="`drawer-slide-${position}`">
      <div
        v-if="modelValue"
        class="drawer-container"
        :class="`drawer-${position}`"
      >
        <div v-if="showHeader" class="drawer-header">
          <h3 class="drawer-title">{{ title }}</h3>
          <button
            class="drawer-close"
            @click="$emit('update:modelValue', false)"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div class="drawer-content">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped></style>
