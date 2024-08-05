<script setup lang="ts">
const props = defineProps<{
    className?: string;
}>();

const baseClasses = `
    size-10 flex items-center justify-center rounded-full bg-white shadow-sm
    hover:bg-gray-100 focus-visible:outline focus-visible:outline-2
    focus-visible:outline-offset-2 focus-visible:outline-indigo-600
`;
const computedClass = cn(baseClasses, props.className);
</script>

<template>
    <button
        type="button"
        :class="computedClass"
    >
        <slot />
    </button>
</template>