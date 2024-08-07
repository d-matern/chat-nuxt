import { getQuery } from "ufo";
import prisma from "~/lib/prisma";
import type { Peer } from "crossws";

const systemUser = {
    id: "1",
    name: "System",
    created_at: "07.08.2024, 00:00:01"
};
const connectedPeers = new Map<string, { online: boolean }>(); // Создаем карту подключенных пользователей

export default defineWebSocketHandler({
    open(peer) {
        console.log(`[ws] open ${peer}`);
        const userId = getUserId(peer);
        connectedPeers.set(userId, { online: true }); // Добавляем нового пользователя в карту подключенных пользователей
        
        const stats = getStats();
        const userName = getUserName(peer);
        peer.send(
            sendSystem(
                `Добро пожаловать в чат ${userName}! (Пользователей онлайн: ${stats.online}/${stats.total})`
            )
        );

        peer.subscribe("chat");
        peer.publish("chat", sendSystem(`Пользователь ${userName} подключился!`));
    },
    async message(peer, message) {
        console.log("[ws] message", peer, message);
        const payload = JSON.parse(message.toString());

        if (payload.text === "ping") {
            peer.send(JSON.stringify({ type: "pong" }));
            return;
        }

        try {
            const savedMessage = await prisma.message.create({
                data: {
                    ...payload
                },
                include: {
                    author: true
                }
            });
            const successResponse = {
                type: "success",
                message: savedMessage
            };

            // Отправляем успешное сообщение только отправителю
            peer.send(JSON.stringify(successResponse));
            peer.publish("chat", {
                type: "new_message",
                message: savedMessage
            });
        } catch (error) {
            console.error("Ошибка отправки сообщения:", error);
            const errorResponse = {
                type: "error",
                message: "Ошибка отправки сообщения",
            };
            peer.send(JSON.stringify(errorResponse));
        }
    },
    close(peer, event) {
        console.log(`[ws] close ${peer}`);

        const userId = getUserId(peer);
        connectedPeers.set(userId, { online: false });
    },
    error(peer, error) {
        console.log(`[ws] error ${peer}`, error);
    }
});

function getUserId(peer: Peer) {
  const query = getQuery(peer.url);
  return query.userId as string;
};

function getUserName(peer: Peer) {
  const query = getQuery(peer.url);
  return query.name as string;
};

function getStats() {
  const online = Array.from(connectedPeers.values()).filter((u) => u.online).length;
  return { online, total: connectedPeers.size };
};

function sendSystem(text: string) {
    return {
        type: "new_message",
        message: {
            id: Date.now().toString(),
            author: systemUser,
            authorId: systemUser.id,
            created_at: new Date().toLocaleString(),
            text
        }
    };
}