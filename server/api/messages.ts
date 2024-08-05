import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
    const messages = await prisma.message.findMany({
        take: 25,
        include: {
            author: true
        }
    });

    return { messages };
});