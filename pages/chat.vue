<script setup lang="ts">
import { useUserStore } from '~/store/user';

let ws: WebSocket | undefined;

const router = useRouter();
const config = useRuntimeConfig();
const { user, logout } = useUserStore();

const message = ref("");
const serverError = ref("");

const messages = useState<MessageDetailsModel[]>(() => []);
if (!messages.value.length) {
    const response = await $fetch("/api/messages");
    messages.value.push(...response.messages);
}

watch(() => user, (newValue) => {
    if (!newValue) {
        router.push("/");
    } 
}, { immediate: true });

const createMessageJSON = (text: string) => {
    return JSON.stringify({
        authorId: user?.id,
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

const connectWS = async () => {
    // const url = `${config.public.ws}://${location.host}/api/chat-ws?userId=${user?.id}`;
    const url = `wss://${location.host}/api/chat-ws?userId=${user?.id}`;
    if (ws) {
        console.log("ws: Закрытие предыдущего соединения перед повторным подключением...");
        ws.close();
        clear();
    }

    console.log("ws: Подключаемся к", url, "...");
    ws = new WebSocket(url);

    ws.addEventListener("message", (event) => {
        const res: WSResponseModel = JSON.parse(event.data);
        if (res.type === "error") {
            serverError.value = res.message.toString();
        } else {
            messages.value.push(res.message as MessageDetailsModel);
        }
    });

    await new Promise((resolve) => ws!.addEventListener("open", resolve));
    console.log("ws: Подключились!");
};

const send = () => {
    console.log("Отправка сообщения...");
    if (message.value) {
        const data = createMessageJSON(message.value);
        ws!.send(data);
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
                @click="handleLogout"
            >
                Выход
            </button>
            </div>
        </div>
    </main>
</template>