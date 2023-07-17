import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";
import { failedResponse, IFailedResponse } from "@utils/http";

interface ErrorValidationType {
  [key: string]: string[];
}

export const handleValidationError = (
  req: Request,
  res: Response<IFailedResponse<any>>,
  next: NextFunction
): void => {
  const errors: any = validationResult(req);
  if (errors.isEmpty()) return next();

  const extractedErrors: ErrorValidationType = {};

  console.log({ errors: { ...errors } });

  errors.array().map((err: any) => {
    if (!(err.path in extractedErrors)) extractedErrors[err.path] = [err.msg];
  });

  res.json(failedResponse(extractedErrors, "RequiredField"));
};
