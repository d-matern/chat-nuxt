<template>
    <input
        v-model="modelValue"
        class="
            w-full p-1.5 block rounded-md border-0 text-gray-900
            shadow-sm ring-1 ring-inset ring-gray-300
            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600
            sm:text-sm sm:leading-6
        "
    />
</template>

<script setup lang="ts">
const modelValue = defineModel();
</script>