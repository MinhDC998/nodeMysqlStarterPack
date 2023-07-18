import { failedResponse } from "@utils/http";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY as string, (err: any, user: any) => {
    console.log(err);

    if (err) return res.json(failedResponse(err.message, "CredentialError"));

    // @ts-ignore
    req.user = user;
    req.body.userId = user.id;
    req.body.tenantId = req.headers["tid"] ? +req.headers["tid"] : null;

    return next();
  });

  return false;
}
