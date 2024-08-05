<script setup lang="ts">
const props = withDefaults(defineProps<{
    className?: string;
    variant?: "default" | "outlined";
    to?: string;
}>(), {
    variant: "default"
});

const baseClasses = "w-full px-3 py-1.5 flex justify-center rounded-md";
const classes = reactive({
    default: `
        text-white text-sm font-semibold leading-6
        bg-indigo-600 shadow-sm
        hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-indigo-600
    `,
    outlined: `
        text-indigo-600 text-sm font-semibold leading-6
        bg-white shadow-sm border hover:text-white
        hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-indigo-600
    `,
});
const computedClass = cn(baseClasses, classes[props.variant], props.className);
</script>

<template>
    <NuxtLink
        v-if="to"
        :class="computedClass"
        :to="to"
    >
        <slot />
    </NuxtLink>
    <button
        v-else
        type="button"
        :class="computedClass"
    >
        <slot />
    </button>
</template>