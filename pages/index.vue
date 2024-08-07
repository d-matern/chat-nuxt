<script setup lang="ts">
import { useUserStore } from '~/store/user';

// let ws: WebSocket | undefined;

// const config = useRuntimeConfig();
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

// const connectWS = async () => {
//     const url = `${config.public.ws}://${location.host}/api/user/`;
//     if (ws) {
//         console.log("ws: Закрытие предыдущего соединения перед повторным подключением...");
//         ws.close();
//     }

//     console.log("ws: Подключаемся к", url, "...");
//     ws = new WebSocket(url);

//     ws.addEventListener("message", (event) => {
//         const res: WSResponseModel = JSON.parse(event.data);
//         if (res.type === "error") {
//             serverError.value = res.message.toString();
//         } else {
//             setUser(res.message as UserDetailsModel);
//             router.push("/chat");
//         }
//     });

//     await new Promise((resolve) => ws!.addEventListener("open", resolve));
//     console.log("ws: Подключились!");
// };

// const onSubmit = async () => {
//     serverError.value = "";

//     if (!name) {
//         serverError.value = "Введите имя";
//         return;
//     }

//     ws!.send(name.value);
//     name.value = "";
// };

// onMounted(async () => {
//     connectWS();
// });
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