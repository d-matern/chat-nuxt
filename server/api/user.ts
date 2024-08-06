import prisma from "~/lib/prisma";

export default defineWebSocketHandler({
    open(peer) {
        console.log("[ws] open", peer);
    },
    async message(peer, message) {
        console.log("[ws] message", peer, message);

        // Проверяем пришли ли данные
        if (!message || typeof message.text() !== "string") {
            const errorResponse = {
                type: "error",
                message: "Ведите Ваше имя"
            };
            peer.send(JSON.stringify(errorResponse));
            return;
        }

        try {
            const user = await prisma.user.findUnique({
                where: {
                    name: message.text()
                }
            });
            if (user) {
                const successResponse = {
                    type: "success",
                    message: user
                };
                peer.send(JSON.stringify(successResponse));
                return;
            }

            const savedUser = await prisma.user.create({
                data: {
                    name: message.text()
                }
            });
            const successResponse = {
                type: "success",
                message: savedUser
            };
            peer.send(JSON.stringify(successResponse));
            return;
        } catch (error) {
            console.error("Ошибка добавления пользователя:", error);
            const errorResponse = {
                type: "error",
                message: "Ошибка создания профиля",
            };
            peer.send(JSON.stringify(errorResponse));
        }
    },
    close(peer, event) {
        console.log("[ws] close", peer, event);
    },
    error(peer, error) {
        console.log("[ws] error", peer, error);
    }
});