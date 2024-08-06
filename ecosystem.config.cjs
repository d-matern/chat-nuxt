module.exports = {
    apps: [
        {
            name: "chat-nuxt",
            port: "3000",
            exec_mode: "cluster",
            instances: "max",
            script: "./.output/server/index.mjs",
            env: {
                DATABASE_URL: "file:./dev.db",
                NUXT_PUBLIC_BASE_URL: "dmatern.ru/api/",
            }
        },
    ],
};