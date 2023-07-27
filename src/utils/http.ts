import { Request, Response } from "express";

interface ISuccessResponse<D> {
  data: D;
  statusCode: string;
}

export interface IFailedResponse<E> {
  message: E;
  statusCode: string;
}

type IResponse<D> = ISuccessResponse<D> | IFailedResponse<D>;

export const successResponse = <D>(data: D): ISuccessResponse<D> => ({
  data,
  statusCode: "OK",
});
export const failedResponse = <E>(
  message: E,
  statusCode: string
): IFailedResponse<E> => ({ message, statusCode });

export type customResponse<D> = Response<IResponse<D | string>>;

export type customRequest<P = any, B = any, Q = any> = Request<P, any, B, Q>;
export type requestBody<B> = Request<unknown, unknown, B>;
export type requestParams<P> = Request<P>;
export type requestQuery<Q> = Request<unknown, unknown, unknown, Q>;

export type TSearch<D> = D & { offset: number; limit: number };
