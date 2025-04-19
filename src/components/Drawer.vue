<script setup>
import { onBeforeUnmount, ref, watch, nextTick } from 'vue';

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

const drawerRef = ref(null);
const previouslyFocusedElement = ref(null);

// Function to handle Tab key and trap focus
const handleTabKey = (event) => {
  if (!props.modelValue || !drawerRef.value) return;

  const focusableElements = drawerRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // If shifting backwards and on the first element, move to the last element
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  }
  // If moving forwards and on the last element, cycle to first element
  else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
};

// Enhanced ESC key handler
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && props.closeOnEsc && props.modelValue) {
    event.preventDefault();
    event.stopPropagation();
    emit('update:modelValue', false);
  } else if (event.key === 'Tab') {
    handleTabKey(event);
  }
};

// Watch for drawer open/close
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      // Store the currently focused element to restore focus later
      previouslyFocusedElement.value = document.activeElement;

      // Focus the drawer after it's fully rendered
      nextTick(() => {
        drawerRef.value?.focus();
      });

      // Add keyboard event listener for focus trapping
      document.addEventListener('keydown', handleKeyDown);
    } else {
      // Remove keyboard event listener when drawer closes
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus to the element that opened the drawer
      if (previouslyFocusedElement.value) {
        nextTick(() => {
          previouslyFocusedElement.value.focus();
        });
      }
    }
  },
);

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown);
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
        ref="drawerRef"
        tabindex="-1"
        role="dialog"
        aria-labelledby="drawer-title"
      >
        <div v-if="showHeader" class="drawer-header">
          <h3 class="drawer-title" id="drawer-title">{{ title }}</h3>
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
