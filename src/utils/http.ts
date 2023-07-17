import { Request, Response } from "express";

interface ISuccessResponse<D> {
  data: D;
  status: string;
}

interface IFailedResponse<E> {
  error: E;
  status: string;
}

type IResponse<D> = ISuccessResponse<D> | IFailedResponse<D>;

export const successResponse = <D>(data: D): ISuccessResponse<D> => ({
  data,
  status: "OK",
});
export const failedResponse = <E>(
  error: E,
  status: string
): IFailedResponse<E> => ({ error, status });

export type customResponse<D> = Response<IResponse<D | string>>;

export type customRequest<P = any, B = any, Q = any> = Request<P, any, B, Q>;
export type requestBody<B> = Request<unknown, unknown, B>;
export type requestParams<P> = Request<P>;
export type requestQuery<Q> = Request<unknown, unknown, unknown, Q>;

export type TSearch<D> = D & { offset: number; limit: number };
