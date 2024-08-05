export default defineWebSocketHandler({
    open(peer) {
        console.log("[ws] open", peer);
    },

    message(peer, message) {
        console.log("[ws] message", peer, message);
        const { created_at, text } = JSON.parse(message.toString());
        
        if (text === "ping") {
            peer.send({
                id: Date.now(),
                author: {
                    id: Date.now(),
                    name: "Server"
                },
                text: "pong",
                created_at: new Date().toLocaleString()
            });
            return;
        }
    },

    close(peer, event) {
        console.log("[ws] close", peer, event);
    },

    error(peer, error) {
        console.log("[ws] error", peer, error);
    }
});