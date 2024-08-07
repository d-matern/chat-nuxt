<script setup lang="ts">
import { useUserStore } from '~/store/user';

let ws: WebSocket | undefined;

const router = useRouter();
const config = useRuntimeConfig();
const { user } = storeToRefs(useUserStore());
const { logout } = useUserStore();
console.log(user.value);

const message = ref("");
const serverError = ref("");

const response = await $fetch("/api/messages");
const messages = useState<MessageDetailsModel[]>("messages", () => response.messages);

const createMessageJSON = (text: string) => {
    return JSON.stringify({
        authorId: user.value?.id,
        text,
        created_at: new Date().toLocaleString(),
    });
};

const scroll = () => {
    nextTick(() => {
        console.log("скроллим");
        window.scrollTo(0, document.body.scrollHeight + 100);
    });
};


const clear = () => {
    messages.value.splice(0, messages.value.length);
};

const handleMessage = (event: MessageEvent) => {
    const res: WSResponseModel = JSON.parse(event.data);
    if (res.type === "error") {
        serverError.value = res.message.toString();
    } else if (res.type === "success") {
        messages.value.push(res.message as MessageDetailsModel);
    } else if (res.type === "new_message") {
        messages.value.push(res.message as MessageDetailsModel);
    }
    scroll();
};

const handleError = (event: Event) => {
    console.error("WebSocket ошибка:", event);
};

const handleClose = (event: CloseEvent) => {
    console.log("WebSocket соединение закрыто:", event);
    // Переустановите WebSocket соединение при необходимости
    connectWS();
};

const connectWS = async () => {
    const url = `${config.public.ws}://${location.host}/api/chat-ws?userId=${user.value?.id}`;
    if (ws) {
        console.log("ws: Закрытие предыдущего соединения перед повторным подключением...");
        ws.removeEventListener("message", handleMessage); // Убедитесь, что обработчики удалены
        ws.removeEventListener("error", handleError);
        ws.removeEventListener("close", handleClose);
        ws.close();
        clear();
    }

    console.log("ws: Подключаемся к", url, "...");
    ws = new WebSocket(url);

    ws.addEventListener("message", handleMessage);
    ws.addEventListener("error", handleError);
    ws.addEventListener("close", handleClose);

    await new Promise((resolve) => ws!.addEventListener("open", resolve));
    console.log("ws: Подключились!");
};

const send = () => {
    console.log("Отправка сообщения...");
    if (message.value) {
        if (ws?.readyState === WebSocket.OPEN) {
            const data = createMessageJSON(message.value);
            ws!.send(data);
        } else {
            console.warn("WebSocket не открыт. ReadyState:", ws?.readyState);
        }
    }
    message.value = "";
};

const handleLogout = () => {
    logout();
    router.push("/");
};

onMounted(async () => {
    connectWS();
    scroll();
});

onUnmounted(() => {
    if (ws) {
        ws.removeEventListener("message", handleMessage);
        ws.removeEventListener("error", handleError);
        ws.removeEventListener("close", handleClose);
        ws.close();
    }
});
</script>

<template>
    <main class="h-screen">
        <!-- Сообщения -->
        <div
            id="messages"
            class="min-h-screen px-4 pt-8 pb-21 flex flex-col justify-end bg-slate-900 sm:pb-12"    
        >

            <div
                v-for="message in messages"
                :key="message.id"
                :class="`flex flex-col mb-4 ${user?.id === message.authorId ? 'items-end' : 'items-start'}`"
            >
                <p class="text-gray-500 mb-1 text-xs ml-10">
                    {{ message.author.name }}
                </p>
                <div class="flex items-center">
                    <img
                        class="w-8 h-8 rounded-full"
                        :src="`https://www.gravatar.com/avatar/${encodeURIComponent(message.authorId)}?s=512&d=monsterid`"
                        alt="Avatar"
                    />
                    <div class="ml-2 bg-gray-800 rounded-lg p-2">
                        <p class="text-white">
                            {{ message.text }}
                        </p>
                    </div>
                </div>
                <p class="text-gray-500 mt-1 text-xs ml-10">
                    {{ message.created_at }}
                </p>
            </div>
        </div>

        <!-- Chatbox -->
        <div class="bg-gray-800 px-4 py-2 flex items-center justify-between fixed bottom-0 w-full flex-col sm:flex-row">
            <div class="w-full min-w-6">
                <input
                    v-model="message"
                    type="text"
                    placeholder="Введите сообщение..."
                    class="w-full rounded-none px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring focus:border-blue-300 sm:rounded-l-lg"
                    @keydown.enter="send"
                />
            </div>
            <div class="flex w-full">
            <button
                class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 w-1/4"
                @click="send"
            >
                Send
            </button>
            <button
                class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 w-1/4"
                @click="clear"
            >
                Clear
            </button>
            <button
                class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 sm:rounded-r-lg w-1/4"
                @click="logout"
            >
                Выход
            </button>
            </div>
        </div>
    </main>
</template>