import jwt from "jsonwebtoken";
import prisma from "~/lib/prisma";
import { UserCreateModel, UserDetailsModel } from "~/models/UserModel";

const jwtSecret = process.env.SECRET_KEY_JWT || "matern";

export default defineEventHandler(async (e) => {
    let user: UserDetailsModel | null = null;
    const payload = await readBody(e) as UserCreateModel;

    if (!payload.name) {
        throw createError({
            statusCode: 422,
            statusMessage: "Введите корректное имя",
            message: "Введите корректное имя"
        });
    }

    user = await prisma.user.findUnique({
        where: {
            name: payload.name
        }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: payload.name
            }
        });
    }

    const token = jwt.sign(user, jwtSecret, { expiresIn: "1h" });
    return token;
});