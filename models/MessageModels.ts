export interface MessageCreateModel {
    authorId: number;
    created_at: string;
    text: string;
}

export interface MessageDetailsModel {
    id: number;
    author: UserDetailsModel;
    text: string;
    created_at: string;
}