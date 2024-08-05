<script setup lang="ts">
defineProps<{
    user: UserDetailsModel;
}>();
const emit = defineEmits(["update:user"]);
const name = ref("");
const serverError = ref("");

const onSubmit = async () => {
    serverError.value = "";

    if (!name) {
        serverError.value = "Введите имя";
        return;
    }

    try {
        const user = await $fetch("/api/user");
        console.log(useCookie("user"));
        
        emit("update:user", user);
    } catch (error: any) {
        serverError.value = error.data.message;
    }
};
</script>

<template>
    <FormContainer
        class="w-full space-y-6"
        title="Введите Ваше имя"
        :footer="{
            text: 'Хотели бы увидеть код?',
            url: 'https://github.com/3dmatern/chat-nuxt',
            urlText: 'GitHub'
        }"
        @submit.prevent="onSubmit"
    >
        <FormLabelContainer>
            <FormInputField
                id="name"
                v-model="name"
                type="text"
                autocomplete="first name"
                required
            />
        </FormLabelContainer>

        <FormErrorMessage v-if="serverError">
            {{ serverError }}
        </FormErrorMessage>

        <UiButton type="submit">Войти в чат</UiButton>
    </FormContainer>
</template>