export interface WSResponseModel {
    type: "error" | "success";
    message: MessageDetailsModel | UserDetailsModel | string;
}