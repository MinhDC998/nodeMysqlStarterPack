export enum ERole {
    ADMIN = 'admin',
    MODERATOR = 'mod',
    USER = 'user',
}

export interface IRole {
    name: ERole
    createdAt: number
    updatedAt: number
}