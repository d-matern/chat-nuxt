import { jwtDecode } from "jwt-decode";
import { useUserStore } from "~/store/user";

interface ParseToken extends UserDetailsModel {
    iat: number;
    exp: number;
}

export default defineNuxtRouteMiddleware((to) => {
    const { authenticated, user } = storeToRefs(useUserStore());
    const accessToken = useCookie("access_token");
    
    if (accessToken.value) {
        try {
            const timeNotMSecond = Math.floor(Date.now() / 1000);
            const decoded = jwtDecode(accessToken.value) as ParseToken;
            const isExpiredToken = decoded.exp <= timeNotMSecond;

            if (isExpiredToken) {
                authenticated.value = false;
                user.value = null;
                accessToken.value = null;
            } else {
                authenticated.value = true;
                user.value = {
                    ...decoded,
                    token: accessToken.value
                };
            }
        } catch (error) {
            authenticated.value = false;
            user.value = null;
            accessToken.value = null;
        }
    }

    if (to.path.includes("/chat") && !authenticated.value) {
        return navigateTo("/");
    }
});