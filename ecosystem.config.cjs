module.exports = {
    apps: [
        {
            name: "chat-nuxt",
            port: "3000",
            exec_mode: "cluster",
            instances: "max",
            script: "./.output/server/index.mjs",
            env: {
                NUXT_PUBLIC_WS: "wss",
            }
        },
    ],
};