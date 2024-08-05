<script setup lang="ts">
defineProps<{
    name?: string;
    errorMessage?: string | null;
}>();
</script>

<template>
    <label class="block text-sm font-medium leading-6 text-gray-900">
        <span class="block mb-2">
            <slot name="name" />
            {{ name }}
        </span>
        <slot />
        <p class="text-red-600">
            <slot name="error-message" />
            {{ errorMessage }}
        </p>
    </label>
</template>