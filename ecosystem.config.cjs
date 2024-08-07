module.exports = {
    apps: [
        {
            name: "chat-nuxt",
            port: "3000",
            exec_mode: "cluster",
            instances: "max",
            script: "./.output/server/index.mjs",
            env_dev: {
                DATABASE_URL: "postgresql://login:pass@localhost:5432/name_database?schema=public",
                SECRET_KEY_JWT: "",
                NUXT_PUBLIC_WS: "ws",
            },
            env_prod: {
                DATABASE_URL:"postgresql://login:pass@localhost:5432/name_database?schema=public",
                SECRET_KEY_JWT: "",
                NUXT_PUBLIC_WS: "wss",
            }
        },
    ],
};