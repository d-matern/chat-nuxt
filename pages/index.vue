<script setup lang="ts">
import { useUserStore } from '~/store/user';
const { authenticateUser } = useUserStore();

const name = ref("");
const serverError = ref("");

const onSubmit = async () => {
    serverError.value = "";

    if (!name) {
        serverError.value = "Введите имя";
        return;
    }

    try {
        authenticateUser(name.value);
    } catch (error: any) {
        console.error(error.data.message);
        serverError.value = error.data.message;
    }
};
</script>

<template>
    <main class="min-h-screen px-4 flex items-center justify-center">
        <FormContainer
            class="w-full max-w-96 p-4 space-y-6 shadow"
            title="Авторизация"
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
                    placeholder="Введите Ваше имя"
                    required
                />
            </FormLabelContainer>

            <FormErrorMessage v-if="serverError">
                {{ serverError }}
            </FormErrorMessage>

            <UiButton type="submit">Войти в чат</UiButton>
        </FormContainer>
    </main>
</template>