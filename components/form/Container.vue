<script setup lang="ts">
defineProps<{
    title?: string;
    footer?: {
        text: string;
        url: string;
        urlText: string;
    }
}>();
</script>

<template>
    <form class="mt-10">
        <h2 class="mb-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {{ title }}
        </h2>

        <slot />

        <p class="mt-10 text-center text-sm text-gray-500">
            {{ footer?.text }}
            <NuxtLink
                :to="footer?.url"
                class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
                {{ footer?.urlText }}
            </NuxtLink>
        </p>
    </form>
</template>
