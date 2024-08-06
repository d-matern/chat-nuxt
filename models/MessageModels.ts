export interface MessageCreateModel {
    authorId: number;
    created_at: string;
    text: string;
}

export interface MessageDetailsModel extends MessageCreateModel {
    id: number;
    author: UserDetailsModel;
}