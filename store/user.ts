import type { UserDetailsModel } from "~/models/UserModel";

export const useUserStore = defineStore("user", {
    state: (): {
        user: UserDetailsModel | null;
    } => ({
        user: null
    }),
    actions: {
        setUser(payload: UserDetailsModel) {
            this.user = payload;
        },
        logout() {
            this.user = null;
        }
    }
});