export interface UserCreateModel {
    name: string;
}

export interface UserDetailsModel extends UserCreateModel {
    id: number;
}