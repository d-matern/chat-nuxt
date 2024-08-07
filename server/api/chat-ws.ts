import prisma from "~/lib/prisma";

const connectedPeers = new Set(); // Создаем множество подключенных пользователей

export default defineWebSocketHandler({
    open(peer) {
        const isPeer = connectedPeers.has(peer);
        if (!isPeer) {
            console.log("[ws] open", peer);
            connectedPeers.add(peer); // Добавляем нового пользователя в множество подключенных пользователей
        } else {
            console.log("[ws] open: повторное открытие соединения");
        }
    },
    async message(peer, message) {
        console.log("[ws] message", peer, message);
        const payload = JSON.parse(message.toString());

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

            // Отправляем новое сообщение всем остальным подключенным пользователям
            connectedPeers.forEach((connectedPeer) => {
                console.log(connectedPeer !== peer);
                
                if (connectedPeer !== peer) {
                    connectedPeer.send(JSON.stringify({ type: "new_message", message: savedMessage }))
                }
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
        console.log("[ws] close", peer, event);
        connectedPeers.delete(peer); // Удаляем пользователя из множества при закрытии соединения
    },
    error(peer, error) {
        console.log("[ws] error", peer, error);
    }
});