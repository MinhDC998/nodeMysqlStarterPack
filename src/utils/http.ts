import { Request, Response } from 'express';

interface ISuccessResponse<D> {
    data: D
    status: string
}

interface IFailedResponse<E> {
    error: E
    status: string
}

type IResponse<D> = ISuccessResponse<D> | IFailedResponse<D>

export const successResponse = <D>(data: D): ISuccessResponse<D> => ( { data, status: 'OK' } );
export const failedResponse = <E>(error: E, status: string): IFailedResponse<E> => ( { error, status } );

export interface customRequest<P = any, B = any, Q = any> extends Request<P, any, B, Q> {};
export interface customResponse<D> extends Response<IResponse<D | string>> {}