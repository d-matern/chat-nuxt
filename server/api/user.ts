import prisma from "~/lib/prisma";
import { UserCreateModel } from "~/models/UserModel";

export default defineEventHandler(async (event) => {
    const { name } = await readBody(event) as UserCreateModel;
    if (!name) {
        throw createError({
            statusCode: 401,
            statusMessage: "Введите Ваше имя"
        });
    }

    const user = await prisma.user.create({
        data: {
            name
        }
    });
    setCookie(event, "user", JSON.stringify(user));
    return user;
});