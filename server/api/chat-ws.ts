import prisma from "~/lib/prisma";

export default defineWebSocketHandler({
    open(peer) {
        console.log("[ws] open", peer);
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
            peer.send(JSON.stringify(successResponse));
            return;
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
    },
    error(peer, error) {
        console.log("[ws] error", peer, error);
    }
});