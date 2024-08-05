<script setup lang="ts">
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiClose } from "@mdi/js";

const isOpen = defineModel(false);
</script>

<template>
    <div
        v-if="isOpen"
        class="min-w-full min-h-screen flex items-center justify-center fixed"
    >
        <div class="w-full max-w-96 p-4 relative bg-white">
            <button
                class="absolute top-4 right-4 hover:text-blue-600"
                type="button"
                @click="isOpen = false"
            >
                <SvgIcon type="mdi" :path="mdiClose" />
            </button>

            <slot />
        </div>
    </div>
</template>