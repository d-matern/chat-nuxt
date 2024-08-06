<script setup lang="ts">
import { useUserStore } from '~/store/user';

let ws: WebSocket | undefined;

const router = useRouter();
const config = useRuntimeConfig();
const { setUser } = useUserStore();

const name = ref("");
const serverError = ref("");

const connectWS = async () => {
    // const url = `${config.public.ws}://${location.host}/api/user/`;
    const url = `wss://${location.host}/api/user/`;
    if (ws) {
        console.log("ws: Закрытие предыдущего соединения перед повторным подключением...");
        ws.close();
    }

    console.log("ws: Подключаемся к", url, "...");
    ws = new WebSocket(url);

    ws.addEventListener("message", (event) => {
        const res: WSResponseModel = JSON.parse(event.data);
        if (res.type === "error") {
            serverError.value = res.message.toString();
        } else {
            setUser(res.message as UserDetailsModel);
            router.push("/chat");
        }
    });

    await new Promise((resolve) => ws!.addEventListener("open", resolve));
    console.log("ws: Подключились!");
};

const onSubmit = async () => {
    serverError.value = "";

    if (!name) {
        serverError.value = "Введите имя";
        return;
    }

    ws!.send(name.value);
    name.value = "";
};

onMounted(async () => {
    connectWS();
});
</script>

<template>
    <FormContainer
        class="w-full p-4 space-y-6"
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
</template>