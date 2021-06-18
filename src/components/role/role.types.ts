import { ICommonListRequest } from '@root/types/common.types';

export enum ERole {
    ADMIN = 'admin',
    MODERATOR = 'mod',
    USER = 'user',
}

export interface IRole {
    id: number
    name: ERole
    createdAt?: number
    updatedAt?: number
}

export interface ICreateRoleRequest {
    name: ERole
}

export interface IListRoleRequest extends ICommonListRequest {}
