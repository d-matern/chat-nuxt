module.exports = {
    apps: [
        {
            name: "chat-nuxt",
            port: "3000",
            exec_mode: "cluster",
            instances: "max",
            script: "./.output/server/index.mjs",
            env_dev: {
                NUXT_PUBLIC_WS: "ws",
            },
            env_prod: {
                NUXT_PUBLIC_WS: "wss",
            }
        },
    ],
};