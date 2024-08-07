import type { UserDetailsModel } from "~/models/UserModel";

export const useUserStore = defineStore("user", {
    state: (): {
        authenticated: boolean;
        user: UserDetailsModel | null;
    } => ({
        authenticated: false,
        user: null
    }),
    actions: {
        async authenticateUser(name: string) {
            const data = await $fetch<string>("/api/user-http", {
                method: "post",
                body: { name }
            });
            
            if (data) {
                const accessToken = useCookie("access_token");
                accessToken.value = data;
                this.authenticated = true;
            }
            navigateTo("/chat");
        },
        logout() {
            const accessToken = useCookie("access_token");
            accessToken.value = null;
            this.authenticated = false;
            this.user = null;
            navigateTo("/");
        }
    }
});