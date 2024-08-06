<script setup lang="ts">
let ws: WebSocket | undefined;

const isOpenModal = ref(false);

const userCookie = useCookie<string>("user");
const user = ref({} as UserDetailsModel);

const message = ref("");
const messages = useState<MessageDetailsModel[]>(() => []);
if (!messages.value.length) {
    const response = await $fetch("/api/messages");
    messages.value.push(...response.messages);
}

watch(userCookie, (newValue) => {
    console.log(newValue);
    
    if (!newValue) {
        isOpenModal.value = true;
    } else {
        user.value = JSON.parse(newValue);
    }
}, { immediate: true });

const createMessage = (text: string) => {
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

// Метод для системных сообщений
const log = (user: string, ...args: string[]) => {
  console.log("[ws]", user, ...args);
  messages.value.push({
    id: 0,
    text: args.join(" "),
    author: {
        id: 0,
        name: "System"
    },
    created_at: new Date().toLocaleString(),
  });
  scroll();
};

const clear = () => {
    messages.value.splice(0, messages.value.length);
    log("system", "предыдущие сообщения удалены");
};

const connect = async () => {
    const isSecure = location.protocol === "https:";
    const url = (isSecure ? "wss://" : "ws://") + location.host + "/api/chat-ws?userId=" + user.value?.id;
    if (ws) {
        log("ws", "Закрытие предыдущего соединения перед повторным подключением...");
        ws.close();
        clear();
    }

    log("ws", "Подключаемся к", url, "...");
    ws = new WebSocket(url);

    ws.addEventListener("message", (event) => {
        console.log("client event.data", event.data);
        const data: MessageDetailsModel = JSON.parse(event.data);
        log( data.author.name, data.text);
    });

    await new Promise((resolve) => ws!.addEventListener("open", resolve));
    log("ws", "Подключились!");
};

const send = () => {
    console.log("Отправка сообщения...");
    if (message.value) {
        const data = createMessage(message.value);
        ws!.send(data);
    }
    message.value = "";
};

onMounted(async () => {
    connect();
    scroll();
});
</script>

<template>
    <main class="h-screen flex flex-col justify-between">
        <!-- Сообщения -->
        <div
            id="messages"
            class="min-h-screen px-4 pt-8 pb-21 flex flex-col flex-grow justify-end bg-slate-900 sm:pb-12"    
        >
            <div
                class="flex items-center mb-4 overflow-x-scroll"
                v-for="message in messages"
                :key="message.id"
            >
                <div class="flex flex-col">
                    <p class="text-gray-500 mb-1 text-xs ml-10">
                        {{ message.author.name }}
                    </p>
                    <div class="flex items-center">
                        <img
                            :src="'https://www.gravatar.com/avatar/' + encodeURIComponent(message.user) + '?s=512&d=monsterid'"
                            alt="Avatar" class="w-8 h-8 rounded-full"
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
                class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 sm:rounded-r-lg w-1/4"
                @click="clear"
            >
                Clear
            </button>
            </div>
        </div>
    </main>
</template>