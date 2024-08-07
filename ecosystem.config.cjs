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
                DATABASE_URL: "postgresql://login:pass@localhost:5432/name_database?schema=public"
            },
            env_prod: {
                NUXT_PUBLIC_WS: "wss",
                DATABASE_URL:"postgresql://login:pass@localhost:5432/name_database?schema=public"
            }
        },
    ],
};